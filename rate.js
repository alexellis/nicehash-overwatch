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

module.exports = getExchangeRates;

/* getExchangeRates("1J6GWiBvj6CdDSQoQETymDkJonZcrFGJrh", (err, rates)=> {
  if(err) {
   console.error(err);
  }
  console.log(rates)
}) */