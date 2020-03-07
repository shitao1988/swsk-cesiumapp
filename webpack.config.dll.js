const path = require("path");
const webpack = require("webpack");
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')

const vendor = [
  "react",
  "react-dom",
  "react-router-dom",
  "antd",
  "axios",
  "turf-jsts",
  "lodash"
];

const dllPath = path.join(__dirname, 'dist');

module.exports = {
  entry: {
    dll: vendor
  },
  output: {
    path: dllPath,
    filename: "[name].js",
    library: "_dll_[name]"
  },
  plugins: [
		new webpack.DllPlugin({
	    name: "_dll_[name]",
			path: path.join(__dirname, 'dist','manifest.json'),
	  }),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		}),
	]
}
