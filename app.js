var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var posts = require('./routes/posts');

require('node-jsx').install({extension: '.jsx'});
var ReactAsync = require('react-async');
var App = require('./react/App.jsx');

var app = express();

var mongoose = require('mongoose');
var dbName = 'reactApp';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString, function() {
  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api', posts);

  app.get('*', function(req, res) {
    var path = url.parse(req.url).pathname;
    ReactAsync.renderComponentToStringWithAsyncState(App({path: path}), function(err, markup) {
      res.send('<!DOCTYPE html>'+markup);
    });
  });

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 400;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
});

module.exports = app;
