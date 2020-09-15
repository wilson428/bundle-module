const path = require('path');
const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
const postcssPresetEnv = require('postcss-preset-env');
// const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//const runtime = require('@babel/runtime/helpers/typeof');
//const ptr = require('@babel/plugin-transform-runtime');

//https://developerhandbook.com/webpack/how-to-configure-scss-modules-for-webpack/

function generateConfig(opts) {
	let MODE = opts.minified ? 'production' : 'development';
	let isDevelopment = MODE === 'development';

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
			new webpack.ProgressPlugin(),
			new MiniCssExtractPlugin({
				filename: isDevelopment ? '[name].css' : '[name].[hash].css',
				chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
			})
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
								plugins: () => [ postcssPresetEnv() ]
							}
						}
					]
				},
				{
					test: /\.(sa|sc|c)ss$/i,
					use: [
						isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								esModule: true
							}

						},	
						'sass-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										'postcss-preset-env'
									]
								}
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
					use: [
						{
							loader: 'ejs-loader',
							options: {
								esModule: false
							}
						}
					]
				},
				{
					test: /\.(c|d|t)sv$/i,
					use: 'dsv-loader'
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: {
						loader: 'url-loader',
						options: {
							limit: 8192,
							esModule: false
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