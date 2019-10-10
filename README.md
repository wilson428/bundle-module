# Bundle Modules for the Browser

v0.8

Webpack is an incredible toolkit for compiling and transpiling Node modules for use in the browser. The only drawback, I've found, is that keeping the configuration files and their many dependencies in every local project directory can lead to a lot of bloat in `node_modules` and requires a fair degree of tedious copying and pasting when many projects use essentially the same configuration.

This module generates a configuration file outside the project and returns a packaged file for the browser in the project directory.

## Installation

	npm install -g wilson428/bundle-module

## Usage

	# cd /path/to/project
	bundle-module --name=myproject

This basic usage will create a `dist` directory in your project with a file called `myproject.js` that can be included on a Web page in a single `<script>` tag. The project itself can include any local dependencies you wish -- D3, for example.

## Command-line options

| Option | Purpose | Default |
| :--- | :--- | :--- |
| `--version`, `-v`  | Return the version and exit | `false` |
| `--entry` | The root Node file in your project to send to Webpack for compiling. | `index.js` |
| `--output_dir` | The name of the local directory to contain the compiled file | `dist`  |
| `--name` | The name used in the compiled file. There's no need to include `.js`. | `bundle` |
| `--min`, `--minified` | Whether to minify the output, which will automatically have the name `[name].min.js` | `false` |
| `--watch` | Whether to recompile after every file change | `false` |
| `--verbose` | Whether to output the (long) configuration file| `false` |

## Supported loaders

At present, `bundle-module` will understand the following file types when included with `import` or `require`. If you commonly use a filetype that requires a different [loader](https://webpack.js.org/loaders/), such as a different templating engine, by all means let me know or, better yet, send me a PR!

+ `.js`: Javascript files are automatically transpiled with [Babel](https://babeljs.io/), allowing you to write your module in ES6.
+ `.json`: Node understands JSON imports by default.
+ `.css`, `.scss`, `.less`: Includes the `postcss-loader` loader with the `postcssPresetEnv` plugin for autoprefixing.
+ `.html`, `.ejs`: You can either `require` plain HTML or [Embedded JavaScript templates](https://ejs.co/).
+ `.csv`, `.dsv`, `tsv`: You can require any sort of delimited data file, which will appear in the code like a JSON file.
+ `.png`, `.jpe?g`, `.gif`: Include images as base64 data. Be mindful of filesize.
