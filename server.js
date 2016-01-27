var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var logger = require('./lib/logger.js');
var express = require('express');
var error_handler = require('./middleware/error_handler');
var path = require('path');
var app = express();
var nconf = require('./controllers/configureNconf.js')();
var compression = require('compression');
var reactRouter = require('./public/dist/js/server-bundle.js').reactRouter;


require('fs').writeFileSync('.rebooted', 'rebooted');

//middleware that logs requests
//app.use(morgan("tiny"));

/**gzip compression**/
app.use(compression());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//middleware that turns a query string into req.query, and form
//post data to req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

//middle ware that turns json posted to the server (i.e. json
//sent in a raw format) into req.body
app.use(bodyParser.json());

//Middleware that parses cookies that are sent to the server
// and put's them into the req.cookie field
app.use(cookieParser('lets gogogo', {}));


/* Specify where express will server static content from*/
app.use('/bower_components', express.static(__dirname +'/bower_components/'));
app.use('/img', express.static(path.resolve(__dirname, 'public/img')));
app.use(express.static(path.resolve(__dirname, 'public/dist')));

/* Setup favicon */
app.use(favicon(__dirname + '/public/img/favicon.ico'));

/* Middleware that handles errors.  If at some point
 next(err) is called where err is a truthy value, this middleware
 will be executed.
 */
app.use(error_handler.loggingErrorHandler);
app.use(error_handler.errorHandler);

app.use(reactRouter);


/**
 Starts the server
 */
var port = nconf.get('PORT');
if (!port) {
  throw new Error ("No PORT env set");
}
app.listen(port, function(){
  logger.log('Listening on port ' + port)
});


