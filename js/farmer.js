import * as http from './http-promise';

function getLocal(zip, callback) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip="
    return http.get2(url + zip)
                    .then(JSON.parse);
}

function getDetail(id) {
    const url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=";
    return http.get(url + id)
                    .then(JSON.parse);
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
        // .then(printData)
        .then((data) => {
            printData(data['results']);
            getAll(data);
        })
        .catch((err) => console.log(err));
}

test();