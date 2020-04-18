#!/usr/bin/env node

const fs = require('fs');
const util = require('util')
const package = require("./package.json");
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const generateConfig = require("./lib/generateConfig.js");

if (argv.v || argv.version) {
	console.log(package.version);
	process.exit();
}

let name = argv.name || "bundle";
// name = name.replace(/\.min|\.js/g, "");
name = name.replace(/\.js/g, "");

let filename = name;
if (argv.min || argv.minified) {
	argv.min = true;
	if (!/min/.test(filename)) {
		filename += ".min";
	}
}
filename += ".js";

const options = {
	env: argv.env || "browser",
	entry: argv.entry || "./index.js",
	output: {
		path: path.resolve(process.cwd(), argv.output_dir || "./dist"),
		library: name,
		filename: filename,
		libraryExport: argv.export_name || "default"
	},
	minified: (argv.min || argv.minified) ? true : false,
	source_map: argv.source_map || (argv.min ? false : true ),
	verbose: argv.verbose ? argv.verbose : false,
};


const config = generateConfig(options);

if (argv.profile) {
	config.profile = true;
}

const compiler = webpack(config);


function describeStats(err, stats) {
	if (argv.stats) {
		fs.writeFileSync(options.output.path + "/stats.json", JSON.stringify(stats.toJson(), null, 2));
	}

	if (err || stats.hasErrors()) {
		let errorMessages = stats.compilation.errors;

		// hack way to show error without the endless babel stack
		errorMessages.forEach(errorMessage => {
			let obj_strs = util.inspect(errorMessage, true, 3, true).split(/\n/g);
			// console.log(obj_strs);
			obj_strs.forEach((line, l) => {
				if (!/ +at /.test(line) && !/\[message\]/.test(line) && !/\[stack\]/.test(line) && !/Module(.*?)Error/.test(line)) {
					console.log(line);
				}
			});
		});

		console.log("\x1b[31m", "Failed to build. See above for source of errors.");
		console.log("\x1b[0m");
	} else {
		console.log("\x1b[32m", `Successfully compiled ${ options.output.path + "/" + options.output.filename } without errors!`);
		console.log("\x1b[0m");		
	}
}


if (argv.watch) {
	const watching = compiler.watch({
		aggregateTimeout: 300,
		poll: argv.profile || false
	}, (err, stats) => { // Stats Object
		describeStats(err, stats);		
	});
} else {
	compiler.run((err, stats) => {
		describeStats(err, stats);
	});
}