/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

import path from "path";
import webpack from "webpack";
import writeStats from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";

const assetsPath = path.resolve(__dirname, "../public/assets");

const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;

export default {
  devtool: "cheap-module-eval-source-map",
  entry: {
    "main": [
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./client.js"
    ]
  },
  output: {
    path: assetsPath,
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[hash].js",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/assets/`
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" },
      { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "babel?cacheDirectory"] },
     // { test: /\.scss$/, loader: "style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true" },
      { test: /\.less$/, loader: "style!css!autoprefixer?browsers=last 2 version!less" }, // use instead postcss([autoprefixer]).process()
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!sass' },

        //demetris added json loader to webpack to support aws sdk
      { test: /\.json$/, loader: 'json' },
      //{ test: /\.css$/, loader: "css-loader" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
    ]
  },
  progress: true,
  plugins: [

    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // print a webpack progress
    new webpack.ProgressPlugin((percentage, message) => {
      const MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
      const CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
      process.stdout.write(`${CLEAR_LINE}${Math.round(percentage * 100)}%: ${message}${MOVE_LEFT}`);
    }),

    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development")
      }
    }),
      //new webpack.IgnorePlugin(new RegExp("^(aws-sdk|aws-dynamodb)$")),
    // stats
    function() { this.plugin("done", notifyStats); },
    function() { this.plugin("done", writeStats); }

  ]
};
