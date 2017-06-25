
import * as api from './market-data.js';


function addSummary(market, parent) {
    const summary = document.createElement('div');
    summary.className = 'market-summary';

    // Create header for elemen
    const name = document.createElement('h3');
    const milesAndName = market['marketname'].split(/ (.+)/);
    $('<span>' + milesAndName[0] + 'mi</span>').addClass('distance').appendTo(name);
    $('<span> ' + milesAndName[1] + '</span>').addClass('market-name').appendTo(name);

    api.detail(market['id'])
        .then((data) => {
            // make address linking to maps
            const address = document.createElement('p');
            const link = api.mapsLink(data);
            const text = api.address(data);
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
        hasMore: function () { // can't use arrow function due to 'this' binding
            return (this.data != undefined && this.lastDisplayed < this.data.length);
        },
    };

    // Listen for zip code search
    $('#submit-search').click((e) => {
        // clear old results
        $('.market-summary-wrapper').empty();
        markets.data = {};
        markets.lastDisplayed = 0;

        // generate new results
        api.local($('#zipcode').val())
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
