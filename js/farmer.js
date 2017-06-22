import * as http from './http-promise';

const BASE_URL = 'http://127.0.0.1:5000/yourmarket/api'


function getLocal(zip, callback) {
    const url = BASE_URL + '/zip/' + zip;
    return http.get(url, 'json').then((data) => data['results']);
}

function getDetail(id) {
    const url = BASE_URL + '/id/' + id;
    return http.get(url, 'json');
}

function getAll(marketData) {
    for (var i=0; i < marketData.length; i++) {
        let market = marketData[i];
        getDetail(market['id'])
            .then(printData);
    }
}




function addSummary(market, parent) {
    const summary = document.createElement('div');
    summary.className = 'market-summary';
    const name = document.createElement('h3');
    name.innerHTML = market['marketname'];

    getDetail(market['id'])
        .then((data) => {
            console.log(data);
            const address = document.createElement('p');
            address.innerHTML = '<a href=' + data['GoogleLink'] + '>'
                                + data['Address'] + '</a>';
            summary.appendChild(address);
        });

    summary.appendChild(name);
    parent.append(summary);
}

function makeSummaries(markets, parent, numberToAdd) {
    for (var i=markets.lastDisplayed;
         i < markets.lastDisplayed + numberToAdd; i++) {
        // if all the markets have been displayed, break
        if (i > markets.data.length - 1) {
            break;
        }
        addSummary(markets.data[i], parent);
    }
    markets.lastDisplayed = i;
    if (markets.lastDisplayed >= markets.data.length) {
        $('#more-results').removeClass('visible');
    }
}


function init() {
    const markets = {
        data: {},
        lastDisplayed: 0
    };

    // Listen for zip code search
    $('#submit-search').click((e) => {
        // clear old results
        $('.market-summary-wrapper').empty();
        markets.data = {};
        markets.lastDisplayed = 0;

        // generate new results
        getLocal($('#zipcode').val())
            .then((data) => {
                markets.data = data;
                makeSummaries(markets, $('#summary-wrapper'), 9);

                // Display button to get more results
                $('#more-results').addClass('visible');
                $('#more-results').click((e) => {
                    makeSummaries(markets, $('#summary-wrapper'), 9);
                });
            })
            .catch((err) => console.log(err));
    });
}

$(document).ready(init);
