const path = require('path');
const webpack = require('webpack');

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
					test: /\.(sa|sc|c)ss$/i,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: {
									compileType: 'icss',
								}
							}
						},
						{
							loader: 'sass-loader',
							// options: {
							// 	implementation: require('sass') // Prefer `dart-sass`
							// }
						},						
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
						{
							loader: 'css-loader',
							options: {
								modules: {
									compileType: 'icss',
								}
							}
						},
						'less-loader',
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
	}

	if (opts.verbose) {
		console.log(config);
	}

	return config;
}

module.exports = generateConfig;