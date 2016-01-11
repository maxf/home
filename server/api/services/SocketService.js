/* global Utils, Socket */

var Utils = require('../services/utils');
var request = require('request');

// convert a model Socket object into an object more suitable to views
var viewSocket = function(socket) {
  var startTime = Utils.minsToHm(socket.startTime);
  var stopTime = Utils.minsToHm(socket.stopTime);
  return {
    id: socket.id,
    description: socket.description,
    physicalSocket: socket.physicalSocket,
    switchedOn: socket.switchedOn,
    timerMode: socket.timerMode,
    startTime: Utils.pad(startTime.h, 2) + ':' + Utils.pad(startTime.m, 2),
    stopTime: Utils.pad(stopTime.h, 2) + ':' + Utils.pad(stopTime.m, 2),
    random: socket.random,
    randomBreaks: socket.randomBreaks
  }
};

var modelSocket = function(viewSocket) {
  return {
    description: viewSocket.description,
    physicalSocket: parseInt(viewSocket.physicalSocket, 10),
    switchedOn: viewSocket.switchedOn === 'on',
    timerMode: viewSocket.timerMode === 'on',
    startTime: Utils.hmToMins(viewSocket.start.slice(0,2),
                            viewSocket.start.slice(3,5)),
    stopTime: Utils.hmToMins(viewSocket.end.slice(0,2),
                            viewSocket.end.slice(3,5)),
    random: viewSocket.random === 'on',
    randomBreaks: viewSocket.randomBreaks === 'on'
  };
};

var secs = function(h, m, s) {
  return h*3600+m*60+s;
}



function turnOnOrOffSocket(socket) {
  var url = sails.config.globals.socketsApiUrl + socket.physicalSocket +
    '/' + (socket.switchedOn ? 'on' : 'off');
  sails.log('Sending: ', url);

  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      sails.log('An error occurred when setting a socket: ', url);
    }
  });
}

module.exports = {
  turnOnOrOffSocket: function(socketId, next) {
    Socket.find({id: socketId}).exec(function(err, socket) {
      turnOnOrOffSocket(socket);
    });
  },
  getSockets: function(next) {
    Socket.find().exec(function(err, sockets) {
      if(err) throw err;
      next && next(sockets);
    });
  },
  addSocket: function(socketVal, next) {
    Socket.create(socketVal).exec(function(err, socket) {
      if(err) throw err;
      turnOnOrOffSocket(socket);
      if (socket.timerMode) {
        SchedulerService.update(socket);
      }
      next && next(socket);
    });
  },
  removeSocket: function(socketId, next) {
    Socket.destroy(socketId).exec(function(err, socket) {
      if(err) throw err;
      next && next(socket);
    });
  },
  modifySocket: function(socketId, newValue, next) {
    Socket.find({id: socketId}).exec(function(err, oldSockets) {
      var oldSocket = oldSockets[0];
      if (err) throw err;

      // We should update the socket's switchedOn with the new schedule

      Socket.update({id: socketId}, newValue).exec(function(err, updated) {
        var newSocket = updated[0];
        if (err) throw err;
        if (newSocket.timerMode &&
           (newSocket.startTime != oldSocket.startTime ||
            newSocket.stopTime != oldSocket.stopTime ||
            newSocket.random  != oldSocket.random ||
            newSocket.randomBreaks != oldSocket.randomBreaks)) {
          SchedulerService.update(newSocket);
        }
        turnOnOrOffSocket(newSocket);
        next && next(updated[0]);
      });
    });
  },

  getSocketsForView: function(next) {
    Socket.find().exec(function(err, sockets) {
      var viewSockets;
      if (err) throw err;
      viewSockets = sockets.map(viewSocket);
      next(viewSockets);
    });
  },

  addSocketFromView: function(socketVal, next) {
    var socket = modelSocket(socketVal);
    this.addSocket(socket, next);
  },

  modifySocketFromView: function(socketVal, next) {
    var socket = modelSocket(socketVal);
    this.modifySocket(socketVal.id, socket, next);
  },

  socketIsInHours: function() {
    var now = new Date();
    var timeNow = secs(now.getHours(), now.getMinutes(), now.getSeconds());
    return !(timeNow < this.startTime*60 || timeNow > this.stopTime*60);
  }

};
