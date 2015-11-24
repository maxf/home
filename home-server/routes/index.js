'use strict';

var require, module;

var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  res.render('index', { title: 'Dashboard' });
});


module.exports = router;
