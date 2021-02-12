const bundleModule = require('../index.js');

    // "build": "../bundle.js --entry=./myApp/index.js --filename=HP.node --env=node --output_dir=./demo",
    // "build_verbose": "../bundle.js --entry=./myApp/index.js --filename=HP.node --env=node --output_dir=./demo --verbose",
    // "minify": "../bundle.js --entry=./myApp/index.js --name=HP.node --env=node --output_dir=./demo --min",
    // "watch": "../bundle.js --entry=./myApp/index.js --name=HP.node --env=node --output_dir=./demo --watch",
    // "build_browser": "../bundle.js --entry=./myApp/browser.js --name=HP --filename=HP.bundle --output_dir=./demo",
    // "minify_browser": "../bundle.js --entry=./myApp/browser.js --name=HP --filename=HP.bundle --output_dir=./demo --min"

bundleModule({
	entry: './myApp/index.js',
	filename: 'HP.script.js',
	env: 'node',
	output_dir: './demo'
});

bundleModule({
	entry: './myApp/browser.js',
	name: 'HP',
	filename: 'HP.script.bundle.js',
	env: 'browser',
	output_dir: './demo',
	min: true
});