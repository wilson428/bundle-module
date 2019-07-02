#!/usr/bin/env node

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const generateConfig = require("./lib/generateConfig.js");

console.log(__dirname);

let filename = argv.filename || "bundle";
filename = filename.replace(/\.min|\.js/g, "");

const options = {
	entry: argv.entry || "./index.js",
	output: {
		path: path.resolve(__dirname, argv.output_path || "./dist"),
		filename: filename + (argv.min || argv.minified ? ".min" : "") + ".js",
	},
	minified: (argv.min || argv.minified) ? true : false 
};

generateConfig(options);

/*
const compiler = webpack({
  // Configuration Object
});


webpack({
  // Configuration Object
}, (err, stats) => { // Stats Object
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
});
*/