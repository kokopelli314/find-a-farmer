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
exports.local = local;
exports.detail = detail;
exports.allDetails = allDetails;
exports.mapsLink = mapsLink;
exports.address = address;

var _httpPromise = __webpack_require__(2);

var http = _interopRequireWildcard(_httpPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var BASE_URL = 'http://127.0.0.1:5000/yourmarket/api';

// Return summary of markets near zip
//  Wrapper for calls to retreive market data

function local(zip, callback) {
    var url = BASE_URL + '/zip/' + zip;
    return http.get(url, 'json');
}

// get detailed information for a certain market ID
function detail(id) {
    var url = BASE_URL + '/id/' + id;
    return http.get(url, 'json');
}

// get detailed information for a group of market summaries
function allDetails(marketData) {
    for (var i = 0; i < marketData.length; i++) {
        var market = marketData[i];
        getDetail(market['id']).then(printData);
    }
}

// Get Google Maps link from market detail data
function mapsLink(market) {
    var link = 'https://maps.google.com/?q=' + encodeURI(market['y'] + ',' + market['x'] + ' ("' + market['MarketName'] + '")');
    return link;
}

// return address of market
function address(market) {
    var address = [market['street'], market['city'], market['zip']].join(', ');
    return address;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _marketData = __webpack_require__(0);

var api = _interopRequireWildcard(_marketData);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function addSummary(market, parent) {
    var summary = $('<div/>').addClass('market-summary');

    // Create header for element
    var name = document.createElement('h3');
    $('<span> ' + market['MarketName'] + '</span>').addClass('market-name').appendTo(name);

    // make address linking to maps
    var address = document.createElement('p');
    var link = api.mapsLink(market);
    var text = api.address(market);
    address.innerHTML = '<a href=' + link + '>' + text + '</a>';

    // update DOM
    console.log('hi');
    summary.append(name);
    summary.append(address);
    parent.append(summary);
}

function makeSummaries(markets, parent, numberToAdd) {
    for (var i = markets.lastDisplayed; i < markets.lastDisplayed + numberToAdd; i++) {
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

function addTagToggle(tagText, parent) {
    var tag = $('<button>' + tagText + '</button>').addClass('tag-toggle');
    tag.appendTo(parent);
    tag.click(function (e) {
        tag.toggleClass('selected');
    });
}

function makeTags(markets, parent) {
    for (var i = 0; i < markets.length; i++) {
        addTagToggle(markets[i]['marketname'], parent);
    }
}

function init() {
    // Market data singleton
    var markets = {
        data: [],
        lastDisplayed: 0,
        // hasMore: true if there are more markets to display
        hasMore: function hasMore() {
            // can't use arrow function due to 'this' binding
            return this.data != undefined && this.lastDisplayed < this.data.length;
        }
    };

    // Listen for zip code search
    $('#submit-search').click(function (e) {
        // clear old results
        $('.market-summary-wrapper').empty();
        markets.data = {};
        markets.lastDisplayed = 0;

        // generate new results
        api.local($('#zipcode').val()).then(function (data) {
            markets.data = data;
            console.log(data);

            // Display market data
            makeSummaries(markets, $('#summary-wrapper'), 9);

            // Display button to get more results
            if (markets.hasMore()) {
                $('#more-results').addClass('visible');
                $('#more-results').click(function (e) {
                    makeSummaries(markets, $('#summary-wrapper'), 9);
                });
            }

            // Show tags to toggle/filter with
            makeTags(markets, $('#tag-toggle-wrapper'));
        }).catch(function (err) {
            return console.log(err);
        });
    });
}

$(document).ready(init);

/***/ }),
/* 2 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map