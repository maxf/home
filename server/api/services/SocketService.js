/* global Utils, Socket */

Utils = require('../services/utils');

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

module.exports = {
  getSockets: function(next) {
    Socket.find().exec(function(err, sockets) {
      if(err) throw err;
      next(sockets);
    });
  },
  addSocket: function(socketVal, next) {
    Socket.create(socketVal).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  },
  removeSocket: function(socketId, next) {
    Socket.destroy(socketId).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  },
  modifySocket: function(socketId, newValue, next) {
    Socket.update({id: socketId}, newValue).exec(function(err, updated) {
      if(err) throw err;
      next(updated);
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
    this.addSocket(socket, function(success) {
      next(success);
    });
  },

  modifySocketFromView: function(socketVal, next) {
    var socket = modelSocket(socketVal);
    this.modifySocket(socketVal.id, socket, function(success) {
      next(success);
    });
  }

};
