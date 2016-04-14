/* global Utils, Socket, sails */

var Utils = require('./utils');


module.exports = {

  // Group directory entries
  // from:
  // [
  // '01-20160411090729.avi',
  // '01-20160411090730-00.jpg',
  // '02-20160411094227.avi',
  // '02-20160411094247-00.jpg',
  // '03-20160411102331.avi',
  // '03-20160411102335-01.jpg',
  // '04-20160411102452.avi',
  // '04-20160411102456-00.jpg',
  // '05-20160411103405.avi',
  // '05-20160411103408-00.jpg',
  // '06-20160411103633.avi'...]
  // to:
  // [
  // {
  //   "index": "10",
  //   "avi": "10-20160411125535.avi",
  //   "jpg": "10-20160411125536-00.jpg",
  //   "date": "2016-04-11_12.55.36"
  // },
  // {
  //   "index": "11",
  //   "jpg": "11-20160411142333-01.jpg",
  //   "avi": "11-20160411142333.avi",
  //   "date": "2016-04-11_14.23.33"
  // }...]

  // eg
  // groups: [{index: '11',...}]
  // element: "11-20160411142333-01.jpg"

  grouped: function(fileList) {
    var resultObj = {}, resultArr = [];
    var fileNameRe = new RegExp("^([0-9]+)-[0-9]{14}(-[0-9]+)?\.(jpg|avi)$");
    fileList
      .filter(function(fileName) { return fileNameRe.test(fileName); })
      .forEach(function(fileName) {
        var matches = fileName.match(fileNameRe);
        if (!resultObj[matches[1]]) {
          resultObj[matches[1]] = {};
        }
        resultObj[matches[1]].index = matches[1];
        resultObj[matches[1]][matches[3]] = fileName;
      });
    for (var key in resultObj) {
      if (resultObj[key].jpg && resultObj[key].avi) {
        var match = resultObj[key].jpg.match(/^[0-9]+-([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})-[0-9]+\.jpg$/);
        resultObj[key].date = match[1]+'-'+match[2]+'-'+match[3]+'_'+match[4]+'.'+match[5]+'.'+match[6];
        resultArr.push(resultObj[key]);
      }
    }
    return resultArr;
  }

};
