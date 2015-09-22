/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
// Webpack config for creating the production bundle.

require("babel/register");

var path = require("path");
var webpack = require("webpack");
var writeStats = require("./utils/write-stats");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var strip = require("strip-loader");

module.exports = {
 // devtool: "source-map",
  entry: {
    "main": "./client.js"
  },
  output: {
    path: path.join('public', 'js'),
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[hash].js",
    publicPath: '/public/js/'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" },
      { test: /\.js$/, exclude: /node_modules/, loaders: [strip.loader("debug"),strip.loader("console.log"),strip.loader("debug.enable"), "babel-loader"] },
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style", "css!autoprefixer?browsers=last 2 version!less") },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
    ]
  },
  progress: true,
  plugins: [

    // ignore debug statements
    new webpack.NormalModuleReplacementPlugin(/debug/, process.cwd() + "/webpack/utils/noop.js"),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin("[name]-[chunkhash].css"),

    // set global vars
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),

        // used to know we are on browser
        NODE_ENV: JSON.stringify("production")

      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
        },
        mangle: {
        	except: ['stores','ApplicationStore','RouteStore']
    	}
    }),

    // stats
    function() { this.plugin("done", writeStats); }

  ]
};
