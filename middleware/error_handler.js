var logger = require('../lib/logger.js')
var _ = require('lodash');
module.exports = {
  /**
   Middleware that logs the error message.  Currently this just logs the error to the console, but
   evetually this will write the error to a log that we can review.
   */
  loggingErrorHandler: function(err, req, res, next) {
    if (err) {
      logger.error(err);
      return next(err);
    }
    next();
  },

  /**
   Error handler that responds with the actual error.  The default status code is
   500, unless otherwise specified in err.statusCode
   */
  errorHandler: function(err, req, res, next) {
    if (err) {
      return res.status(err.statusCode || 500).send(err);
    }
    next();
  }
};