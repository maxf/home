/* global Utils, Socket, sails */

var Utils = require('./utils');


module.exports = {

  grouped: function(fileList) {
    var jpegs = fileList.filter(function(fileName) { return /\.jpg$/.test(fileName); }).sort();
    var avis = jpegs.map(function(jpegFileName) {
      var i = fileList.indexOf(jpegFileName);
      return /\.avi$/.test(fileList[i+1]) ? fileList[i+1] : null;
    });

    return jpegs.map(function(file, i) {
      var matches = file.match(/^([0-9]{14})-?([0-9]*)\.jpg$/);
      return {
        date: matches[1],
        jpg: file,
        diff: parseInt(matches[2], 10) || null,
        avi: avis[i]
      };
    });

  }

};
