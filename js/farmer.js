import * as http from './http-promise';


const markets = {
    data: {},
    lastDisplayed: 0
};

function getLocal(zip, callback) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip="
    return http.get(url + zip, 'json').then((data) => data['results']);
}

function getDetail(id) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=";
    return http.get(url + id, 'json').then((data) => data['marketdetails']);
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
            const address = document.createElement('p');
            address.innerHTML = '<a href=' + data['GoogleLink'] + '>'
                                + data['Address'] + '</a>';
            summary.appendChild(address);
        });

    summary.appendChild(name);
    parent.append(summary);
}

function makeSummaries(parent, numberToAdd) {
    console.log('len = ' + markets.data.length);
    console.log('last = ' + markets.lastDisplayed);
    for (var i=markets.lastDisplayed;
         i < markets.lastDisplayed + numberToAdd; i++) {
        // if all the markets have been displayed, break
        console.log('i='+i);
        if (i > markets.data.length - 1) {
            console.log('too many ' + i);
            break;
        }
        addSummary(markets.data[i], parent);
    }
    markets.lastDisplayed = i;
    console.log('new last = ' + markets.lastDisplayed);
    if (markets.lastDisplayed >= markets.data.length) {
        $('#more-results').removeClass('visible');
    }
}


function init() {
    // Listen for zip code search
    $('#submit-search').click((e) => {
        // clear old results
        $('.market-summary-wrapper').empty();

        // generate new results
        getLocal($('#zipcode').val())
            .then((data) => {
                markets.data = data;
                makeSummaries($('#summary-wrapper'), 9);

                // Display button to get more results
                $('#more-results').addClass('visible');
                $('#more-results').click((e) => {
                    makeSummaries($('#summary-wrapper'), 9);
                });
            })
            .catch((err) => console.log(err));
    });
}

$(document).ready(init);
