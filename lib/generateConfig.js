const path = require('path');
const webpack = require('webpack');
const Fiber = require('fibers');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function generateConfig(opts) {
	const MODE = opts.minified ? 'production' : 'development';
	const isDevelopment = MODE === 'development';

	let config = {
		entry: opts.entry,
		output: {
			path: opts.output.path,
			filename: opts.output.filename
		},
		mode: MODE,
		devtool: isDevelopment ? 'inline-source-map' : false,
		resolveLoader: {
			modules: [ path.join(__dirname, '../node_modules/') ],
			mainFields: ['loader', 'main', 'options', 'presets']
		},
		plugins: [
			new webpack.ProgressPlugin(),
			new MiniCssExtractPlugin(),
		],
		experiments: {
			topLevelAwait: true
		},
		module: {
			rules: [{
					test: /\.(js|jsx)$/i,
					exclude: /(node_modules|bower_components)/i,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									require.resolve('@babel/preset-env'), {
										corejs: 3,
										debug: false,
										targets: {
											browsers: [ 'IE 11', ],
										},
										useBuiltIns: 'usage'
									}
								]
							]
						}
					}
				},
				{
					test: /\.txt$/i,
					use: 'raw-loader'
				},			
				{
					test: /\.(sa|sc|c)ss$/i,
					use: [
						'style-loader',
						// {
						// 	loader: MiniCssExtractPlugin.loader,
						// 	options: {
						// 		esModule: false,
						// 	}
						// },
						{
							loader: "css-loader",
							options: {
								importLoaders: 2,
								sourceMap: true,
								modules: {
									mode: "icss",
									// exportOnlyLocals: true,
								},
							}
						},
						{
							loader: "postcss-loader",
							options: {
								postcssOptions: {
									plugins: [
										[
											"postcss-preset-env"
										]
									]
								}
							}
						},				
						// 'resolve-url-loader',
						{
							loader: "sass-loader",
							options: {
								implementation: require.resolve("sass"),
								sourceMap: true,
								sassOptions: {
									fiber: Fiber
								}
							}
						},
					]
				},		
				{
					test: /\.less$/i,
					use: [
						'style-loader',
						'css-loader',
						'less-loader',
						{
							loader: "postcss-loader",
							options: {
								postcssOptions: {
									plugins: [
										[
											"postcss-preset-env"
										]
									]
								}
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
					test: /\.(png|jpe?g|gif)$/i,
					use: {
						//loader: 'base64-inline-loader',
						loader: 'url-loader',
						options: {
							// limit: 8192 * 2,
							esModule: false
						}
					}
				},				
				{
					test: /\.(c|d|t)sv$/i,
					use: 'dsv-loader'
				}
			]
		}
	};

	if (opts.env === "browser") {
		config.output.library = opts.output.library;
		// config.output.libraryTarget = 'window';
		config.output.libraryExport = opts.output.libraryExport;
	}

	if (opts.verbose) {
		console.log(config);
	}

	return config;
}

module.exports = generateConfig;