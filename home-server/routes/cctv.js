'use strict';

var require, module;

var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('cctv', { title: 'CCTV' });
});




module.exports = router;
