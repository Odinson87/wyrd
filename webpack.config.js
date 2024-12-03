const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const outputDir = 'docs';

module.exports = {
	entry: {
		bundle: [
			'./src/global.css',
			'./src/main.js'
		]
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte/src/runtime') // Svelte 3: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		conditionNames: ['svelte']
	},
	output: {
		path: __dirname + '/' + outputDir,
		filename: '[name].[chunkhash].js',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.jpg/,
				type: 'asset/resource'
		 
			}
		]
	},
	optimization: {
		minimizer: [
		    // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
		    // `...`,
		    new CssMinimizerPlugin(),
		],
		splitChunks: {
			chunks: 'all',
		},
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[chunkhash].css'
		}),
		new HtmlWebpackPlugin({
			title: 'Wyrd',
			filename: path.join(__dirname, outputDir, 'index.html'),
			template: path.join(__dirname, 'static','index_template.html'),
			inject: 'body',

		}),
	],
	devtool: prod ? false: 'source-map',
	devServer: {
		static: {
		    directory: path.join(__dirname, outputDir),
		},
		compress: true,
		port: 9000,
		hot: true
	}
};
