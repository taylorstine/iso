var colors = require('colors');
var logger = require('tracer').colorConsole({
  filters: [
    colors.green,
    {
      error: [colors.red, colors.bold],
      warn: [colors.yellow, colors.underline]
    }
  ],
  format: "({{file}}:{{line}}): {{message}}"
});
logger.json = function(obj) {
  logger.log(JSON.stringify(obj, null, 2));
};
module.exports = logger;