#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

if (argv.v || argv.version) {
	console.log(package.version);
	process.exit();
}

const bundleModule = require('./index.js');

bundleModule(argv);