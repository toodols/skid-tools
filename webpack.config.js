const path = require("path");

module.exports = {
	entry: {
		host: "./packages/host/index.ts",
		inspector: "./packages/inspector/index.tsx",
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			//
			{
				test: /\.(s[ac]ss)$/,
				use: ['css-loader', 'sass-loader']
			}
		],
	},
	mode: "development",
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".sass"],
		alias: {
			"@skidtools": path.resolve(__dirname, "packages"),
		},
	},
};
