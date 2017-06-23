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

// Get Google Maps link from market detail data
function getGoogleLink(market) {
    const link = 'https://maps.google.com/?q=' + encodeURI(market['y'] + ',' +
                            market['x'] + ' ("' + market['MarketName'] + '")');
    return (link);
}

function getMarketAddress(market) {
    const address = [market['street'], market['city'], market['zip']].join(', ');
    return (address);
}


function addSummary(market, parent) {
    const summary = document.createElement('div');
    summary.className = 'market-summary';
    const name = document.createElement('h3');
    name.innerHTML = market['marketname'];

    getDetail(market['id'])
        .then((data) => {
            const address = document.createElement('p');
            const link = getGoogleLink(data);
            const text = getMarketAddress(data);
            address.innerHTML = '<a href=' + link + '>' + text + '</a>';
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
    if (markets.hasMore()) {
        $('#more-results').removeClass('visible');
    }
}


function init() {
    // Market data singleton
    const markets = {
        data: [],
        lastDisplayed: 0,
        hasMore: () => {
            return (this.data != undefined && this.lastDisplayed >= this.data.length);
        },
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
                if (markets.hasMore()) {
                    $('#more-results').addClass('visible');
                    $('#more-results').click((e) => {
                        makeSummaries(markets, $('#summary-wrapper'), 9);
                    });
                }
            })
            .catch((err) => console.log(err));
    });
}

$(document).ready(init);
