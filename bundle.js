#!/usr/bin/env node

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const generateConfig = require("./lib/generateConfig.js");

let name = argv.name || "bundle";
name = name.replace(/\.min|\.js/g, "");

let filename = name;
if (argv.min || argv.minified) {
	filename += ".min";
}
filename += ".js";

const options = {
	entry: argv.entry || "./index.js",
	output: {
		path: path.resolve(process.cwd(), argv.output_path || "./dist"),
		library: name,
		filename: filename,
		libraryExport: argv.export_name || "default"
	},
	minified: (argv.min || argv.minified) ? true : false 
};

const compiler = webpack(generateConfig(options));

compiler.run((err, stats) => {
	if (err || stats.hasErrors()) {
		console.error(err);
		console.error(stats.hasErrors());
		console.error(stats);
	} else {
		console.log(`Compiled ${ options.output.path + "/" + options.output.filename } without errors!`)
	}
});