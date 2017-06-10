import * as http from './http-promise';

function getLocal(zip, callback) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip="
    return http.get(url + zip, 'json');
}

function getDetail(id) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=";
    return http.get(url + id, 'json').then((data) => data['marketdetails']);
}

function getAll(marketData) {
    let data = marketData['results'];
    for (var i=0; i < data.length; i++) {
        let market = data[i];
        getDetail(market['id'])
            .then(printData);
    }
}


function makeSummaries(data, parent) {
    const className = 'market-summary';
    const numberOfMarkets = Math.min(data.length, 9);

    for (var i=0; i < numberOfMarkets; i++) {
        const market = data[i];

        const summary = document.createElement('div');
        summary.className = className;
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
        parent.appendChild(summary);
    }
}


function init() {
    // Listen for zip code search
    $('#submit-search').click((e) => {
        // clear old results
        $('.market-summary-wrapper').empty();

        // generate new results
        getLocal($('#zipcode').val())
            .then((data) => makeSummaries(data['results'], document.getElementById('summary-wrapper')))
            .catch((err) => console.log(err));
    });
}

$(document).ready(init);
