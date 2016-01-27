var path = require('path');
var webpack = require('webpack');
var config = {
  entry: path.resolve(__dirname, 'js/server-index.js'),
  output: {
    path: path.resolve(__dirname, 'public/dist/js/'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z][a-z\.\-0-9]*$/,

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
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        loader: 'url?limit=25000'
      },
      // SASS
      {
        test: /\.scss$|\.sass$/,
        exclude: /node_modules/,
        loader: 'style!css!sass'
      }]
  },
  plugins: [
  ]
};

module.exports = config;