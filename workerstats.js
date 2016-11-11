'use strict'

let request = require('request');

let pointSorter = (x, y) => {
  var a = Number(x[1].a);
  var b = Number(y[1].a);
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

let workerStats = (addr, algo, done) => {
  let stats = {
    "workers": [],
    "totalSols": 0  
  };

  let options = {
    url: "https://www.nicehash.com/api?method=stats.provider.workers&addr=" + addr + "&algo=" + algo,
    json: true
  };

  request.get(options, (err, res, body) => {

    if (!err && body && body.result && body.result.workers && body.result.workers.length) {
      stats.workers = body.result.workers.sort(pointSorter);
      stats.workers.forEach((w) => {
        stats.totalSols += Number(w[1].a)
      });
    }

    done(stats);  
  });
};

module.exports = workerStats;