'use strict'

let request = require('request');
let durations = require('humanize-duration');
let rate = require("./rate");

let add = (w) => {
	let acc = 0;
	if(parseInt(w[1].a)) {
		acc += parseInt(w[1].a);
	}
	return acc;
};

let tally = (w) => {
	return w[0] + "\t" + (w[1].a || 0 )+"\t" +durations(w[2]*60*1000, { units: ['d','h','m'] })+"\n";
}

let computeTime = (w) => {
	return w[2];
}

let workerStats = (addr, algo, done) => {
	request.get({url: "https://www.nicehash.com/api?method=stats.provider.workers&addr="+addr+"&algo="+algo, json:true }, (err,res,body)=> {
			if(!err && body && body.result && body.result.workers &&  body.result.workers.length) 
			{
			console.log(body.result.workers.length + " workers enrolled.");
			var val = 0;
			var compute = 0;
			var print = "";
			let workers = body.result.workers.sort((x, y) => {
					var a = Number(x[1].a);
					var b = Number(y[1].a);
					if(a>b) return -1;
					if(a<b) return 1;
					return 0;
					});
			workers.forEach((w)=> {
					val += add(w);
					print+= tally(w);
					compute += computeTime(w);
					});
			console.log(val + " Sols/s.");
			console.log(durations(compute*60*1000, { units: ['d','h','m'] }) + " compute time.");

			console.log("\nNode\tSols/s\tRun time");
			console.log(print);
			}
			done();

	});
};

let totalStats = (addr, excrate, done) => {

	rate(addr, (err, rates) => {

 		request.get({ uri: "https://www.nicehash.com/api?method=stats.provider.ex&addr="+addr+"", json: true }, (err, res, body)=> {

 			if(!err && body && body.result && body.result.current && body.result.current.length) {

				body.result.current.forEach((r) => {
					let record = r;
					let algo = r.name;

					var printRates = (val) => {
						var st = "";
			        		rates.forEach((rate) => {
                                                        st += (val * rate.rate).toFixed(2)+" " + rate.name + "\t"
                                                });
						return st;
					};
					if(Number(r.data[1])) { // balance available
						console.log("=== "+algo+" ===\n");
					//	console.log(r.profitability + " BTC/day\t" + printRates(r.profitability));

						let totalBTC = Number(r.data[1]);
						let exchanges = totalBTC + " BTC balance\t";
						exchanges += printRates(totalBTC);
/*						rates.forEach((rate) => {
							exchanges += (totalBTC * rate.rate).toFixed(2)+" " + rate.name + "\t"
						});*/
						console.log(exchanges+"\n");
					}
				});
			}
			done();
		});
	});
};

var addr = process.env.addr || "1J6GWiBvj6CdDSQoQETymDkJonZcrFGJrh";
var excrate = 0.0014;
var equihash_algo=24;

totalStats(addr, excrate, () => {
		workerStats(addr, 24, () => 
				{
				});
		});
