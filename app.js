'use strict'

let request = require('request');
let durations = require('humanize-duration');
let rate = require("./rate");
let workerStats = require('./workerstats.js') 


let totalStats = (addr, excrate, done) => {

  rate(addr, (err, rates) => {

    request.get({
      uri: "https://www.nicehash.com/api?method=stats.provider.ex&addr=" + addr + "",
      json: true
    }, (err, res, body) => {

      if (!err && body && body.result && body.result.current && body.result.current.length) {

        body.result.current.forEach((r) => {
          let record = r;
          let algo = r.name;

          var printRates = (val) => {
            var st = "";
            rates.forEach((rate) => {
              st += (val * rate.rate).toFixed(2) + " " + rate.name + "\t"
            });
            return st;
          };
          if (Number(r.data[1])) { // balance available
            console.log("=== " + algo + " ===\n");
            //	console.log(r.profitability + " BTC/day\t" + printRates(r.profitability));

            let totalBTC = Number(r.data[1]);
            let exchanges = totalBTC + " BTC balance\t";
            exchanges += printRates(totalBTC);
            /*						rates.forEach((rate) => {
            							exchanges += (totalBTC * rate.rate).toFixed(2)+" " + rate.name + "\t"
            						});*/
            console.log(exchanges + "\n");
          }
        });
      }
      done();
    });
  });
};

var addr = process.env.addr || "1J6GWiBvj6CdDSQoQETymDkJonZcrFGJrh";
var excrate = 0.0014;
var equihash_algo = 24;

totalStats(addr, excrate, () => {
  workerStats(addr, 24, () => {});
});