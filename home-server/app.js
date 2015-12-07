'use strict';

var require, __dirname, module;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var media = require('./routes/media');
var cctv = require('./routes/cctv');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// application global parameters
app.locals.socketsApiUrl = process.env.SOCKETS_API_URL;

app.use('/', routes);
app.use('/api', api);
app.use('/cctv', cctv);
app.use('/media', media);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//-----------------------
// scheduler

app.locals.schedule = [
  {
    start: { hours: 8, minutes: 0, random: true },
    end: { hours: 23, minutes: 0 , random: false },
    quickOnOff: true
  }
];


function timeCheck() {
  console.log('time check at ', new Date());
}


setInterval(timeCheck, 10000);


module.exports = app;
