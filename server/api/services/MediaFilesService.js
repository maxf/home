/* global Utils, Socket, sails */

var Utils = require('./utils');


module.exports = {

  grouped: function(fileList) {
    var jpegs = fileList.filter(function(fileName) { return /\.jpg$/.test(fileName); }).sort();
    var avis = jpegs.map(function(jpegFileName) {
      var i = fileList.indexOf(jpegFileName);
      return /\.avi$/.test(fileList[i+1]) ? fileList[i+1] : null;
    });

    return jpegs.map(function(file, i) { return { date: file.substr(0, 14), jpg: file, avi: avis[i] }; });

  }

};
