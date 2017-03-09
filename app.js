'use strict'

let request = require('request');
let durations = require('humanize-duration');

let getWorkerStats = require('./workerstats.js');
let printer = require('./printer');
let getTotalStats = require('./totalstats.js');

var addr = process.env.addr || "1J6GWiBvj6CdDSQoQETymDkJonZcrFGJrh";
var equihashAlgo = 24;

let getPayStats = require('./paystats');

getPayStats(equihashAlgo, (err, price) => {
    console.log("Equihash payrate:\t" + price + "\tu=" + addr);
    getTotalStats(addr, equihashAlgo, (totalStats) => {
        getWorkerStats(addr, equihashAlgo, (workerstats) => {
            printer.printStats(totalStats, workerstats);
        });
    });
});