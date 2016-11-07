'use strict'

let request = require('request');
let durations = require('humanize-duration');

let add = (w) => {
  let acc = 0;
  if (parseInt(w[1].a)) {
    acc += parseInt(w[1].a);
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

let workerStats = (addr, algo, done) => {
  request.get({
    url: "https://www.nicehash.com/api?method=stats.provider.workers&addr=" + addr + "&algo=" + algo,
    json: true
  }, (err, res, body) => {
    if (!err && body && body.result && body.result.workers && body.result.workers.length) {
      console.log(body.result.workers.length + " workers enrolled.");
      var val = 0;
      var compute = 0;
      var print = "";
      let workers = body.result.workers.sort((x, y) => {
        var a = Number(x[1].a);
        var b = Number(y[1].a);
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });
      workers.forEach((w) => {
        val += add(w);
        print += tally(w);
        compute += computeTime(w);
      });
      console.log(val + " Sols/s.");
      console.log(durations(compute * 60 * 1000, {
        units: ['d', 'h', 'm']
      }) + " compute time.");

      console.log("\nNode\tSols/s\tRun time");
      console.log(print);
    }
    done();

  });
};

module.exports = workerStats;