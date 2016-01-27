var request = require('request');
var fs = require('fs');
var nconf = require('../controllers/configureNconf')();
var _ = require('lodash');
var main = require('../public/dist/js/stats.generated.json').main;
var fileName = _.flatten([main])[0].split('.')[0]

var minName = fileName + '.min.js';
var mapName = fileName + '.map.js';

var options = {
  url: 'https://api.rollbar.com/api/1/sourcemap',
  formData: {
    access_token: '8a4070a1052144deb461913c18977a9b',
    version: '21988',
    source_map: fs.createReadStream(__dirname + '/../public/dist/js/' + mapName)
  }
};


var env = nconf.get("NODE_ENV");
if (env === 'production') {
  options.formData.minified_url ='http://static.app.kinetic.fitness/js/' + minName;
} else if (env === "staging") {
  options.formData.minified_url = 'http://d35c1uuh677ymk.cloudfront.net/js/' + minName;
} else if (env === "local_production") {
  options.formData.minified_url = 'http://localhost:' + nconf.get("PORT") + "/js/" + minName;
} else {
  throw new Error("rollbar-map run with invalid NODE_ENV " + env + " must be one of: 'production', 'staging', or 'local_production'")
}

if (options.formData.minified_url) {
  console.log('uploading source map to rollbar... ');
  request.post(options, function (err, response, body) {
    if (err) {
      return console.error("rollbar upload failed: ", err);
    }
    console.log('upload success!: ', body);
    fs.unlinkSync(__dirname + '/../public/dist/js/' + mapName);
  });
}

