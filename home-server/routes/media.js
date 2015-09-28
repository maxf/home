'use strict';
var require, module;

var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  var dirContents = fs
    .readdirSync('public/images/media')
    .filter(function(fileName) { return /^[-_0-9.]+\.jpg/.test(fileName); })
    .map(function(fileName) {
      var filePrefix = fileName.match(/^([-_0-9.]+)\.jpg/)[1];
      return {'filePrefix': filePrefix,
              'href': '/images/media/'+filePrefix,
              'date': fileName.substr(0, 10) };
    })
  ;
  res.json(dirContents);
});

router.get('/:date', function(req, res, next) {
  var date = req.params.date;
  var dirContents = fs
    .readdirSync('public/images/media')
    .filter(function(fileName) {
      var re=new RegExp('^'+date+'.*\.jpg$');
      return re.test(fileName); }) ;
  res.json(dirContents);
});

module.exports = router;
