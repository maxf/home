'use strict';
var require, module;

var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {

  var mediaByDay = {};
  var dirContents = fs
  .readdirSync('public/images/media')
  .filter(function(fileName) { return /^[-_0-9.]+\.(jpg|mp4)/.test(fileName); })
  .map(function(fileName) { return {'fileName': fileName,
                                    'href': 'public/images/media/'+fileName,
                                    'date': fileName.substr(0, 10)
                                   };
                          })
  .map(function(e) { mediaByDay[e.date] = e; });

  res.json(mediaByDay);
});

module.exports = router;
