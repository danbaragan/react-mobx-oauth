var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// Separate js and css bundles apart. See: https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var rootAssetPath = path.resolve("assets");
var outputPath = path.resolve(rootAssetPath, "bundles");
var publicHost = 'http://localhost:8080';
var publicPath = publicHost + '/assets/bundles/';


module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: {
    app_js: [
      path.resolve(rootAssetPath, "js/index")
    ],
    app_css: [
      path.resolve(rootAssetPath, 'css/index')
    ]
  },
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: "index.[name].min.js",
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(rootAssetPath, 'js'),
        exclude: /(node_modules|__tests__)/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          {
            use: "css-loader",
            fallback: "style-loader",
          }
        ),
      },
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('index.min.css'),
  ].concat(
    debug ? [
      new webpack.HotModuleReplacementPlugin(),
      // new FriendlyErrorsWebpackPlugin(),
    ] : [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
  ),
  devServer: {
    contentBase: rootAssetPath,
    // quiet: true, // required for FriendlyErrorsWebpackPlugin
    host: '0.0.0.0',
    port: '8080',
  }
};
