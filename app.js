
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.post('/savesched/:id', routes.savesched);
app.get('/loadsched/:id', routes.loadsched);
app.get('/schedlist', routes.loadables);
app.get('/getuniqid', routes.newsch);
app.get('/loadresponses/:id',routes.loadresponses);
app.get('/schedule/:id',routes.schedule);
app.get('/assign/:id',routes.assign);
app.post('/savePrefs/:id',routes.saveresponse);
app.post('/genSched',routes.genSched);
app.get('/genSched',routes.getSched);
var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
