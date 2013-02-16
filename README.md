Flashify
========

Flash notifications for Express 3 applications

Installation
============

Firstly install the module via npm:

    npm install flashify
    

Then require it into your application:

    var flashify = require('flashify');

Then tell Express to use the middleware in your configuration function BEFORE app.router :

    app.use(express.cookieParser('secret'));
    app.use(express.session());
    app.use(flashify);
    app.use(app.router);

Usage
=====

Flashify binds itself to your request object so you can easily
set a flash notification by the following:

    app.get('/secret', function(req,res){
      req.flash('Sorry, go away');
      res.redirect('/');
    });

To send a flash notification in the same route with out redirecting, you can do the by using `res.flash`

    app.get('/secret', function(req,res){
      if (req.session.isAdmin)
      {
        res.flash('info','You are an awesome admin because you use flashify');
        res.render('secret/page');
      }
      else 
      {
        req.flash('Sorry, go away');
        res.redirect('/');
      }
    });


Inside your view, you can loop through and get the flash by the following 
(Example in Jade):

    if (flash.message != undefined)
      li= flash.message

Custom Types and Multiples
==========================

You can queue up multiple flash messages with custom types using the same methods as above:

    app.get('/secret', function(req,res){
      req.flash('error', 'Some silly error');
      req.flash('error', 'Some other silly error');
      req.flash('this still queues up as well!')
      req.flash('error', 'Some other other silly error');
      res.redirect('/');
    });