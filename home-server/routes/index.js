'use strict';

var require, module;

var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.post('/', function(req, res, next) {

  request('http://localhost:8000/on', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });

  res.render('index', { title: 'Dashboard' });
});


module.exports = router;
