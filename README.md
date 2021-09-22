# Bundle Modules for the Browser

A no-config tool to bundle your apps into a single file using a remote Webpack configuration that spares you both the need for redundant local Webpack configuration files _and_ an enormous glut of libraries in the _node_modules_ directory of every project.

v0.1.7

Webpack is an incredible toolkit for compiling and transpiling Node modules for use in the browser. The only drawback, I've found, is that keeping the configuration files and their many dependencies in every local project directory can lead to a lot of bloat in `node_modules` and requires a fair degree of tedious copying and pasting when many projects use essentially the same configuration.

This module generates a configuration file outside the project and returns a packaged file for the browser in the project directory.

## Installation

	npm install -g bundle-module

Or, for the edge version:

	npm install -g wilson428/bundle-module

## Usage

### Command Line

	# cd /path/to/project
	bundle-module --name=myproject

### Node

	const bundleModule = require('bundle-module');
	
	bundleModule({
		entry: './myApp/index.js',
		filename: 'myApp.script.js',
		env: 'node',
		output_dir: './dist'
	});


This basic usage will create a `dist` directory in your project with a file called `myproject.js` that can be included on a Web page in a single `<script>` tag. The project itself can include any local dependencies you wish -- D3, for example.

## Command-line options

| Option | Purpose | Default |
| :--- | :--- | :--- |
| `--env` | The target environment for the build. Options are `node` or `browswer` | `browser` |
| `--version`, `-v`  | Return the version and exit | `false` |
| `--entry` | The root Node file in your project to send to Webpack for compiling. | `index.js` |
| `--output_dir` | The name of the local directory to contain the compiled file | `dist`  |
| `--filename` | The name used in the compiled file. There's no need to include `.js`. | `bundle` |
| `--name` | The name of the global variable when exporting for the browser. | `name` (see above) |
| `--min`, `--minified` | Whether to minify the output, which will automatically have the name `[filename].min.js` | `false` |
| `--watch` | Whether to recompile after every file change | `false` |
| `--verbose` | Whether to output the (long) configuration file| `false` |

## Development vs. Production mode

Using `--min` defaults to production mode and generates `bundle-min.js` while omitting it builds an unminified, source-mapped `bundle.js` (whatever name you specified with `--name` instead of `bundle`). To save time, I recommend the following scripts in your `package.json` for a given app:

	"scripts": {
		"build": "bundle-module --entry=./debug.js --name=script --env=node --output_dir=.",
		"build_verbose": "bundle-module --entry=./debug.js --name=script --env=node --output_dir=. --verbose",
		"watch": "bundle-module --entry=./debug.js --name=script --env=node --output_dir=. --watch",
		"minify": "bundle-module --entry=./debug.js --name=script-min --env=node --output_dir=. --min"
	}

Or, if you want to build a distribution script to be included as a global variable via a `<script>` element, use `--env=browser` (or leave it out). The global variable will be give the `--name` parameter.

## Supported loaders

At present, `bundle-module` will understand the following file types when included with `import` or `require`. If you commonly use a filetype that requires a different [loader](https://webpack.js.org/loaders/), such as a different templating engine, by all means <a href="mailto:wilson@mechanicalscribe.com">let me know</a> or, better yet, <a href="https://github.com/wilson428/bundle-module" target="_blank">send me a PR!</a>

+ `.js`: Javascript files are automatically transpiled with [Babel](https://babeljs.io/), allowing you to write your module in ES6.
+ `.json`: Node understands JSON imports by default.
+ `.css`, `.scss`, `.less`: Includes the `postcss-loader` loader with the `postcssPresetEnv` plugin for autoprefixing.
+ `.html`, `.ejs`: You can either `require` plain HTML or [Embedded JavaScript templates](https://ejs.co/).
+ `.csv`, `.dsv`, `tsv`: You can require any sort of delimited data file, which will appear in the code like a JSON file.
+ `.png`, `.jpe?g`, `.gif`: Include images as base64 data. Be mindful of filesize.