import * as http from './http-promise';

function getLocal(zip, callback) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip="
    return http.get(url + zip, 'json');
}

function getDetail(id) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=";
    return http.get(url + id, 'json');
}

function getAll(marketData) {
    let data = marketData['results'];
    for (var i=0; i < data.length; i++) {
        let market = data[i];
        console.log(market['id']);
        getDetail(market['id'])
            .then(printData);
    }
}

function printData(data) {
    let text = JSON.stringify(data, null, 2);
    document.getElementById('data').innerHTML += text;
}

function test() {
    getLocal(80526)
        .then((data) => makeSummaries(data['results'], document.getElementById('summary-wrapper')))
        .catch((err) => console.log(err));
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

        summary.appendChild(name);
        parent.appendChild(summary);
    }
}

test();
