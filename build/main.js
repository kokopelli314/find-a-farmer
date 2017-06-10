/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// Implementation with jQuery
var get = exports.get = function get(url) {
    var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text';

    // return new pending promise
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: dataType,
            async: true,
            statusCode: {
                404: function _(response) {
                    return reject(new Error('404 error - response: ' + response));
                },
                200: function _(response) {
                    return resolve(response);
                }
            },
            error: function error(jqXHR, status, _error) {
                reject(new Error('Failed to load the thing - status ' + status));
            }
        });
    });
};

// Implementation with XMLHttpRequest
var getXMLHttpRequest = exports.getXMLHttpRequest = function getXMLHttpRequest(url) {
    // return new pending promise
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                resolve(request.response);
            } else if (request.readyState == XMLHttpRequest.DONE && (request.status < 200 || request.status > 299)) {
                reject(new Error('Failed to load page - status: ' + request.status));
            }
        };
        request.open('GET', url);
        request.send(null);
    });
};

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _httpPromise = __webpack_require__(0);

var http = _interopRequireWildcard(_httpPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getLocal(zip, callback) {
    var url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=";
    return http.get(url + zip, 'json');
}

function getDetail(id) {
    var url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=";
    return http.get(url + id, 'json');
}

function getAll(marketData) {
    var data = marketData['results'];
    for (var i = 0; i < data.length; i++) {
        var market = data[i];
        console.log(market['id']);
        getDetail(market['id']).then(printData);
    }
}

function printData(data) {
    var text = JSON.stringify(data, null, 2);
    document.getElementById('data').innerHTML += text;
}

function test() {
    getLocal(80526).then(function (data) {
        return makeSummaries(data['results'], document.getElementById('summary-wrapper'));
    }).catch(function (err) {
        return console.log(err);
    });
}

function makeSummaries(data, parent) {
    var className = 'market-summary';
    var numberOfMarkets = Math.min(data.length, 9);

    for (var i = 0; i < numberOfMarkets; i++) {
        var market = data[i];

        var summary = document.createElement('div');
        summary.className = className;
        var name = document.createElement('h3');
        name.innerHTML = market['marketname'];

        summary.appendChild(name);
        parent.appendChild(summary);
    }
}

test();

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map