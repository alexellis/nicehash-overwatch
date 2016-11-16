'use strict'

let request = require('request');
let rateFetch  = require("./rate");

let fetch = (algo, done) => {
    rateFetch.getPayRates(algo, (err, rate) => {
        done(err, rate.price);
    });
};

module.exports = fetch;
