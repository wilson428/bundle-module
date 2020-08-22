const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//const runtime = require('@babel/runtime/helpers/typeof');
//const ptr = require('@babel/plugin-transform-runtime');

function generateConfig(opts) {
	let MODE = opts.minified ? 'production' : 'development';

	let config = {
		entry: opts.entry,
		// target: 'node',
		output: {
			path: opts.output.path,
			filename: opts.output.filename
			// libraryTarget: 'umd'
			// globalObject: 'this'
		},
		mode: MODE,
		devtool: opts.source_map ? 'inline-source-map' : false,
		// context: path.join(__dirname, '../node_modules/'),
		resolveLoader: {
			modules: [ path.join(__dirname, '../node_modules/') ],
			// extensions: ['.js', '.json'],
			mainFields: ['loader', 'main', 'options', 'presets']
		},
		plugins: [
			new webpack.ProgressPlugin()
		],
		module: {
			rules: [{
					test: /\.(js|jsx)$/i,
					exclude: /(node_modules|bower_components)/i,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [ require.resolve('@babel/preset-env') ]
						}
					}
				},
				{
					test: /\.txt$/i,
					use: 'raw-loader'
				},
				{
					test: /\.css$/i,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: () => [ postcssPresetEnv(), cssnano ]
							}
						}
					]
				},
				{
					test: /\.(sa|sc|c)ss$/i,
					use: [
						'style-loader',
						'css-loader',
						'sass-loader',
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: () => [ postcssPresetEnv(), cssnano ]
							}
						}						
					]
				},				
				{
					test: /\.less$/i,
					use: [
						'style-loader',
						'css-loader',
						'less-loader',
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: () => [ postcssPresetEnv() ]
							}
						}
					]
				},
				{
					test: /\.(html|ejs)$/i,
					use: 'ejs-loader'
				},
				{
					test: /\.(c|d|t)sv$/i,
					use: 'dsv-loader'
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: {
						loader: 'file-loader',
						options: {
							outputPath: 'img'
						}
					}
				}
			]
		}
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