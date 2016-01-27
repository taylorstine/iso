var path = require('path');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');
var webpack = require('webpack');

var config = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'js/client-index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'public/dist/js/'),
    publicPath: 'public/dist/js/',
    filename: 'bundle.js'
  },
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    progress: true
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['react-hot', 'babel-loader'],
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
    function() {
      this.plugin("done", function(stats) {
        console.log(stats.toJson().assetsByChunkName);
        fs.writeFileSync(path.join(__dirname, "public", "dist", "js", "stats.generated.json"), JSON.stringify(stats.toJson().assetsByChunkName));
      });
    },
  ],
  cache: true,
  headers: {'Access-Control-Allow-Origin': '*'}
};

module.exports = config;