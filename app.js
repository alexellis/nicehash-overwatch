'use strict'

let request = require('request');
let durations = require('humanize-duration');

let getWorkerStats = require('./workerstats.js'); 
let printer = require('./printer');
let getTotalStats = require('./totalstats.js');

var addr = process.env.addr || "1J6GWiBvj6CdDSQoQETymDkJonZcrFGJrh";
var equihash_algo = 24;

getTotalStats(addr, (totalStats) => {
  getWorkerStats(addr, equihash_algo, (workerstats) => {
    printer.printStats(totalStats, workerstats);
  });
});
