'use strict';
var require, module;

var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  var days = [];
  var dirContents = fs
    .readdirSync('public/images/media')
    .map(function(fileName) {
      var date = fileName.match(/^([-0-9]+)_.*/)[1];
      if (days.indexOf(date) === -1) {
        days.push(date);
      }
    });
  res.json(days);
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
