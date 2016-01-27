var path = require('path');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');
var webpack = require('webpack');

var config = {
  entry: path.resolve(__dirname, 'js/client-index.js'),
  output: {
    path: path.resolve(__dirname, 'public/dist/js/'),
    publicPath: 'public/dist/js/',
    filename: '[hash].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'js')
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css'
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        loader: 'url?limit=25000'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json'
      },

      {
        test: /\.scss$|\.sass$/,
        exclude: /node_modules/,
        loader: 'style!css!sass'
      }]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    function () {
      this.plugin("compile", function () {
        glob(path.join(__dirname, "public", "dist", "js/*.js"), function (err, filenames) {
          _.each(filenames, function (filename) {
            fs.unlinkSync(filename);
          })
        })
      })
      this.plugin("done", function (stats) {
        console.log(stats.toJson().assetsByChunkName);
        fs.writeFileSync(path.join(__dirname, "public", "dist", "js", "stats.generated.json"), JSON.stringify(stats.toJson().assetsByChunkName));
      });
    },
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
    }),
    new webpack.SourceMapDevToolPlugin('[hash].map.js', false, null, null),
  ],
  cache: true
};

module.exports = config;