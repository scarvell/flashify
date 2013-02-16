
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , flashify = require('../lib');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // Flashify requires sessions to be enabled!! 
  app.use(express.cookieParser('hot potato'));
  app.use(express.session());
  
  // Invoke the flashify middleware
  app.use(flashify);
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req,res){
  res.flash('error','Response flash');
  res.render('index', {title: 'Flashify'});
});

app.get('/admin', function(req,res){
  
  // Set some default flash messages before redirect
  // The message type can be whatever you want it to be :)
  req.flash('error','access denied');
  req.flash('error','go away hacker');
  
  res.redirect('/');
});

http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port 3000");
});
