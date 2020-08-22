const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
//const runtime = require('@babel/runtime/helpers/typeof');
//const ptr = require('@babel/plugin-transform-runtime');

function generateConfig(opts) {
	let config = {
		entry: opts.entry,
		// target: 'node',
		output: {
			path: opts.output.path,
			filename: opts.output.filename
			// libraryTarget: 'umd'
			// globalObject: 'this'
		},
		mode: opts.minified ? 'production' : 'development',
		devtool: opts.source_map ? 'inline-source-map' : false,
		module: {
			rules: [{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: path.join(__dirname, '../node_modules/babel-loader/lib/index.js'),
						options: {
							presets: [
								path.join(__dirname, '../node_modules/@babel/preset-env/lib/index.js')
							]
						}
					}
				},
				{
					test: /\.txt$/,
					use: path.join(__dirname, '../node_modules/raw-loader/dist/cjs.js')
				},
				{
					test: /\.css$/,
					use: [
						path.join(__dirname, '../node_modules/style-loader/dist/index.js'),
						{
							loader: path.join(__dirname, '../node_modules/css-loader/dist/cjs.js'),
							options: {
								url: true,
								importLoaders: 1
							}
						},
						{
							loader: path.join(__dirname, '../node_modules/postcss-loader/src/index.js'),
							options: {
								ident: 'postcss',
								plugins: () => [ postcssPresetEnv(), cssnano ]
							}
						}
					]
				},
				{
					test: /\.scss$/,
					use: [
						path.join(__dirname, '../node_modules/style-loader/dist/index.js'),
						{
							loader: path.join(__dirname, '../node_modules/css-loader/dist/cjs.js'),
							options: {
								url: true,
								importLoaders: 1
							}
						},
						path.join(__dirname, '../node_modules/sass-loader/dist/cjs.js'),
						{
							loader: path.join(__dirname, '../node_modules/postcss-loader/src/index.js'),
							options: {
								ident: 'postcss',
								plugins: () => [ postcssPresetEnv() ]
							}
						}
					]
				},				
				{
					test: /\.less$/,
					use: [
						path.join(__dirname, '../node_modules/style-loader/dist/index.js'),
						{
							loader: path.join(__dirname, '../node_modules/css-loader/dist/cjs.js'),
							options: {
								url: true,
								importLoaders: 1
							}
						},
						path.join(__dirname, '../node_modules/less-loader/dist/cjs.js'),
						{
							loader: path.join(__dirname, '../node_modules/postcss-loader/src/index.js'),
							options: {
								ident: 'postcss',
								plugins: () => [postcssPresetEnv()]
							}
						}
					]
				},
				{
					test: /\.(html|ejs)$/,
					use: path.join(__dirname, '../node_modules/ejs-loader/index.js')
				},
				{
					test: /\.(c|d|t)sv$/,
					use: path.join(__dirname, '../node_modules/dsv-loader/index.js')
				},
				{
					test: /\.(png|jpe?g|gif)$/,
					use: {
						loader: path.join(__dirname, '../node_modules/file-loader/dist/cjs.js'),
						options: {
							outputPath: 'img'
						}
					}
				}
			]
		},
		// externals: [ nodeExternals() ],
		plugins: [
			new webpack.ProgressPlugin()
		]
	};

	if (opts.env === "browser") {
		config.output.library = opts.output.library;
		config.output.libraryExport = opts.output.libraryExport;
	} else {

	}

	if (opts.verbose) {
		console.log(config);
	}

	return config;
}

module.exports = generateConfig;