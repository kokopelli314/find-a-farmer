'use strict';

var HttpClient = function HttpClient() {
    this.get = function (url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            } else {
                console.log('--------- Error! ---------');
                console.log(request);
            }
        };
        request.open('GET', url, true);
        request.send(null);
    };
};

function getLocal(zip, callback) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        // submit get request
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
        dataType: 'jsonp',
        success: callback
    });
}

function printMarkets(response) {
    console.log('----------New market');
    console.log(JSON.stringify(response));
    var text = JSON.stringify(response, null, 2);
    document.getElementById('data').innerHTML = text;
}

function test() {
    getLocal(80526, printMarkets);
}

var thing = function thing(a, b) {
    return a + b;
};
console.log(thing(40, 2));
