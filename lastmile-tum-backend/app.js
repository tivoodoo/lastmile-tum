/**
 * Created by DucTien on 08.11.2016.
 */

var Config = require('./config/config.js');
// Patch console.x methods in order to add timestamp information
require('console-stamp')(console, {pattern: "dd/mm/yyyy HH:MM:ss.l"});

/**
 * MongoDB definition.
 */

var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''), {
  user: Config.db.user,
  pass: Config.db.pass
});

// log db connection error and success
var db = mongoose.connection;

db.on('error', function callback(error) {
  console.error('[BACKEND] Error connecting to database ' + Config.db.name);
  console.error(error);
});

db.once('open', function callback() {
  console.log('[BACKEND] Connection to database ' + Config.db.name + ' successful');
});

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
//Logger for request
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// create application
var app = express();

/*
 * Passport
 */
 var passport = require('passport');
 var jwtConfig = require('./authorization/jwtConfig');

 app.use(passport.initialize());
 jwtConfig(passport);

/**
 * App setup.
 */

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

/**
 * Routing.
 */

var userRoutes = require('./api/user/userRoutes');
var requestRoutes = require('./api/request/requestRoutes');
var ratingRoutes = require('./api/rating/ratingRoutes');
var messageRoutes = require('./api/messages/messagesRoutes');


// setting url path
// app.use('/user', userRoutes(passport));
app.use('/user', userRoutes(passport));
app.use('/request', requestRoutes(passport));
app.use('/rating', ratingRoutes(passport));
app.use('/message', messageRoutes(passport));

/**
 * Error handlers.
 */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
