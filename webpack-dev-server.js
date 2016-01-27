var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {

  publicPath: "http://localhost:8080/" + config.output.publicPath,
  hot: true,
  inline: true,
  stats: {
    "cached": false,
    "cachedAssets": false,
    "colors": {
      "level": 1,
      "hasBasic": true,
      "has256": false,
      "has16m": false
    }
  },
  compress: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  host: 'localhost',
  port: 8080,
  outputPath: '/',
  filename: 'bundle.js',
  contentBase: __dirname
}).listen(8080, 'localhost', function(err, result) {
  if (err){
    console.error(err);
  }
  console.log('Dev server listening on localhost:8080')
})

