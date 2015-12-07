'use strict';
var require, module;

var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/:id/on', function(req, res, next) {
  request(req.app.locals.socketsApiUrl + req.params.id + '/on',
          function (error, response, body) {
            res.json({success: !error && response.statusCode == 200});
          });
});

router.post('/:id/off', function(req, res, next) {
  request(req.app.locals.socketsApiUrl + req.params.id + '/off',
   function (error, response, body) {
     res.json({success: !error && response.statusCode == 200});
   });
});

module.exports = router;
