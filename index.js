const fs = require('fs');
const util = require('util')
const package = require("./package.json");
const path = require('path');
const webpack = require('webpack');
const generateConfig = require("./lib/generateConfig.js");

const bundleModule = function(args) {

	const options = {
		env: args.env || "browser",
		entry: args.entry || "./index.js",
		output: {
			path: path.resolve(process.cwd(), args.output_dir || "./dist"),
			libraryExport: args.export_name || undefined,
			library: args.library || 'MyBundle',
        	libraryTarget: args.libraryTarget || 'umd',
		},
		minified: (args.min || args.minified) ? true : false,
		source_map: args.source_map || (args.min ? false : true ),
		verbose: args.verbose ? args.verbose : false,
	};

	let name = args.name || "bundle";
	name = name.replace(/\.js/g, ""); // we'll append .js ourselves

	let filename = args.filename || name;

	if (args.min || args.minified) {
		args.min = true;
		if (!/min/.test(filename)) {
			filename += ".min";
		}
	}

	filename = filename.replace(".js", "") + ".js";

	options.output.library = name;
	options.output.filename = filename;

	const config = generateConfig(options);

	if (args.profile) {
		config.profile = true;
	}

	const compiler = webpack(config);

	function describeStats(err, stats) {
		if (args.stats) {
			fs.writeFileSync(options.output.path + "/stats.json", JSON.stringify(stats.toJson(), null, 2));
		}

		if (err || stats.hasErrors()) {
			let errorMessages = stats.compilation.errors;

			// hacky way to show error without the endless babel stack
			errorMessages.forEach(errorMessage => {
				let obj_strs = util.inspect(errorMessage, true, 3, true).split(/\n/g);

				console.log(obj_strs);

				obj_strs.forEach((line, l) => {
					if (l == 0) {
						console.log(line);
						return;
					}
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

	if (args.watch) {
		const watching = compiler.watch({
			aggregateTimeout: 300,
			poll: args.profile || false
		}, (err, stats) => { // Stats Object
			if (err || stats.hasErrors()) {
				describeStats(err, stats);
			} else {
				console.log("\x1b[32m", `Successfully compiled ${ options.output.path + "/" + options.output.filename } without errors!`);
				console.log("\x1b[0m");					
			}
		});
	} else {
		compiler.run((err, stats) => {
			if (err || stats.hasErrors()) {
				describeStats(err, stats);
			} else {
				console.log("\x1b[32m", `Successfully compiled ${ options.output.path + "/" + options.output.filename } without errors!`);
				console.log("\x1b[0m");					
			}
		});
	}
}

module.exports = bundleModule;