'use strict';

var require, module;

var express = require('express');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});




module.exports = router;
