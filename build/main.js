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
    summary.append(name);
    summary.append(address);
    parent.append(summary);
}

function clearSummaries(markets, parent) {
    parent.empty();
    markets.lastDisplayed = 0;
}

function makeSummaries(markets, parent, numberToAdd) {
    var i = markets.lastDisplayed;
    var added = 0;
    while (added < numberToAdd && i < markets.data.length) {
        var market = markets.data[i];
        i++;
        // skip filtered out markets
        if (market['filters'] > 0) continue;
        addSummary(market, parent);
        added++; // increment number added so far
    }
    markets.lastDisplayed = i;
    if (markets.hasMore()) {
        $('#more-results').removeClass('visible');
    }
}

function makeTags(markets, parent) {
    var market = markets.data[0];
    Object.keys(market).forEach(function (key) {
        // include yes/no categories as filters
        var value = String(market[key]).toUpperCase();
        if (['Y', 'N', '-'].includes(value)) {
            addTagToggle(key, markets, parent);
        }
    });
}

function addTagToggle(tagText, allMarkets, parent) {
    var tag = $('<button>' + tagText + '</button>').addClass('tag-toggle');
    tag.appendTo(parent);
    tag.click(function (e) {
        tagPress(tag, allMarkets);
    });
}

function tagPress(tag, allMarkets) {
    var addFilter;
    var tagText = tag.text();

    // already filtered: remove
    if (allMarkets.filters.includes(tagText)) {
        allMarkets.filters.splice(allMarkets.filters.indexOf(tagText), 1);
        addFilter = false;
        // not already filtered - add it
    } else {
        allMarkets.filters.push(tagText);
        addFilter = true;
    }
    tag.toggleClass('selected');
    toggleFilter(allMarkets, tagText, addFilter);
}

// Toggle a specific tag on each market
// @on {Bool} turn filter on (true) or off (false)
function toggleFilter(markets, tag, on) {
    for (var i = 0; i < markets.data.length; i++) {
        var market = markets.data[i];
        // if this market doesn't include tag, add (or remove) filter
        if (market[tag] != 'Y') {
            market['filters'] += on ? 1 : -1;
        }
    }
    markets.redraw();
}

function init() {
    // Market data singleton
    var markets = {
        data: [],
        lastDisplayed: 0,
        filters: [],
        // hasMore: true if there are more markets to display
        hasMore: function hasMore() {
            // can't use arrow function due to 'this' binding
            return this.data != undefined && this.lastDisplayed < this.data.length;
        },
        redraw: function redraw() {
            clearSummaries(this, $('#summary-wrapper'));
            makeSummaries(this, $('#summary-wrapper'), 9);
        },
        update: function update(data) {
            this.data = data;
            for (var i = 0; i < data.length; i++) {
                this.data[i]['filters'] = 0;
            }
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
            markets.update(data);

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