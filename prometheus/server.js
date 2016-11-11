'use strict'

let promclient = require('prom-client');
let Gauge = promclient.Gauge;
let Histogram = promclient.Histogram;

let express = require('express');
let app = express();

let totalStats = require ("../totalstats");
let workerStats = require ("../workerstats");

let totalBTC = new Gauge('overwatch_total_btc', 'Your total count of bitcoin', [ 'btc' ]);
let totalUSD = new Gauge('overwatch_total_usd', 'Your total funds in USD', [ 'usd' ]);
let totalSols = new Gauge('overwatch_total_sols', 'Your total sols/s', [ 'sols' ]);
let remote_query = new Histogram('overwatch_remote_query', 'Remote queries to Nicehash', [ 'duration' ]);

let addr = process.env.addr;

app.get("/metrics", (req, res) => {
    console.log(".");
    let start = new Date().getTime();
    totalStats(addr, (results) => {
        workerStats(addr, 24, (workerResults) => {
            try {
                totalSols.set( Number(workerResults.totalSols) );
                results.forEach( (r) => {
                    totalBTC.set(Number(r.totalBTC));
                    totalUSD.set(Number(r.currency["USD"]));            
                });
            } catch (e) {
                console.error(e);
                console.error("Bad response from remote endpoint.")
            }
            let end = new Date().getTime();
           	remote_query.labels('duration').observe((end-start) / 1000);

            res.end(promclient.register.metrics());
        });
    });
});

app.listen(process.env.port || 9010, () => {
    console.log("Listening");
});
