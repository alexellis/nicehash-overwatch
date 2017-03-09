'use strict'

let durations = require('humanize-duration');

let add = (w) => {
    let acc = 0;
    if (parseInt(w[1].a)) {
        acc += Number(w[1].a);
    }
    return acc;
};

let tally = (w) => {
    return w[0] + "\t" + (w[1].a || 0) + "\t" + durations(w[2] * 60 * 1000, {
        units: ['d', 'h', 'm']
    }) + "\n";
}

let computeTime = (w) => {
    return w[2];
}

let printStats = (overallStats, workerStats) => {

    overallStats.forEach((result) => {
        if (result.totalBTC) { // balance available
            console.log("=== " + result.algo + " ===\n");
            let exchanges = result.totalBTC + " BTC balance\t";
            Object.keys(result.currency).forEach((currency) => {
                exchanges += result.currency[currency] + " " + currency + "\t";
            });
            console.log(exchanges + "\n");
        }
    });

    if (workerStats.workers.length) {
        console.log(workerStats.workers.length + " workers enrolled.");

        let totalSols = 0;
        let compute = 0;
        let print = "";
        workerStats.workers.forEach((w) => {
            totalSols += add(w);
            print += tally(w);
            compute += computeTime(w);
        });

        console.log(totalSols.toFixed(2) + " Sols/s.");
        console.log(durations(compute * 60 * 1000, { units: ['d', 'h', 'm'] }) + " compute time.");

        console.log("\nNode\tSols/s\tRun time");
        console.log(print);
    }
};

module.exports = {
    printStats: printStats
}