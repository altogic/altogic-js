const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist/umd'),
		filename: 'altogic.js',
		library: {
			type: 'umd',
			name: 'altogic',
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		alias: {
			process: 'process/browser',
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],
	mode: 'production',
};
