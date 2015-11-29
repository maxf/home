'use strict';
var require, module;

var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/on', function(req, res, next) {
  request('http://localhost:8000/on', function (error, response, body) {
    res.json({success: !error && response.statusCode == 200});
  });
});

router.post('/off', function(req, res, next) {
  request('http://localhost:8000/off', function (error, response, body) {
    res.json({success: !error && response.statusCode == 200});
  });
});

module.exports = router;
