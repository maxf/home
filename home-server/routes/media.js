'use strict';
var require, module;

var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  var mediaByDay = [];
  var dirContents = fs
  .readdirSync('public/images/media')
  .filter(function(fileName) { return /^[-_0-9.]+\.jpg/.test(fileName); })
  .map(function(fileName) {
    var filePrefix = fileName.match(/^([-_0-9.]+)\.jpg/)[1];
    return {'filePrefix': filePrefix,
            'href': '/images/media/'+filePrefix,
            'date': fileName.substr(0, 10) }; })
  .map(function(e) {
    var i;
    var found = false;
    for (i=0; i<mediaByDay.length; i++) {
      if (mediaByDay[i].date === e.date) {
        mediaByDay[i].events.push(e);
        found = true; } }
    if (!found) {
      mediaByDay.push({'date': e.date, 'events':[e]}); }});

  res.json(mediaByDay);});

module.exports = router;
