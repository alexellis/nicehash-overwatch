'use strict'

let request = require('request');
let rateFetch  = require("./rate");

let totalStats = (addr, done) => {

  rateFetch.getExchangeRates(addr, (err, rates) => {
    
    let options = {
      uri: "https://www.nicehash.com/api?method=stats.provider.ex&addr=" + addr + "",
      json: true
    };

    request.get(options, (err, res, body) => {
        let results = [];

        if (!err && body && body.result && body.result.current && body.result.current.length) {
            let result = {
                currency : {

                }
            };
            body.result.current.forEach((r) => {
                let record = r;
                let algo = r.name;

                result.algo = algo;
                result.rates = rates;

                let totalBTC = Number(r.data[1]);
                result.totalBTC = totalBTC;

                rates.forEach((rate) => {
                    result.currency[rate.name] = (totalBTC * rate.rate).toFixed(2);
                });
            });
            results.push(result);
        }
        done(results);
    });
  });
};

module.exports = totalStats;