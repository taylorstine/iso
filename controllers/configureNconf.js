var nconf = require('nconf');

module.exports = function() {
  nconf.argv().env();
  nconf.defaults({
    PORT: 3800
  });
  return nconf;
};