'use strict'

let request = require('request');
let durations = require('humanize-duration');
let jsonic = require('jsonic');

let getExchangeRates = (addr, done) => {

    request.get({
        uri: "https://www.nicehash.com/?p=miners&addr=" + addr
    }, (err, res, body) => {
        var rates = "";
        if (!err) {
            var inside = false;
            var lines = body.split("\n")
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("exchangeRates = [") > -1) {
                    inside = true;
                } else {
                    if (inside && lines[i].indexOf("]") > -1) {
                        inside = false;
                    }
                    if (inside) {
                        rates += lines[i] + "\n";
                    }
                }
            }
        }
        rates = "[" + rates + "]";
        done(err, jsonic(rates));
    });
};

let getPayRates = (algo, done) => {
    request.get({
        uri: "https://www.nicehash.com/api?method=stats.global.current",
        json: true
    }, (err, res, body) => {
        var found;
        body.result.stats.forEach((r) => {
            if (r.algo == algo) {
                found = r;
            }
        });
        done(err, found);
    });
};

let getZecRate = (done) => {
    request.get({
        uri: "https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-zec",
        json: true
    }, (err, res, body) => {
        let last = parseFloat(body.result[0].Last);
        done(err, { rate: last });
    });
};

module.exports = {
    getExchangeRates: getExchangeRates,
    getPayRates: getPayRates,
    getZecRate: getZecRate
};

// getZecRate((e,v)=>{console.log(e,v)})