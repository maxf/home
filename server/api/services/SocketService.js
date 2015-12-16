Utils = require('../services/utils');

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
      viewSockets = sockets.map(function(socket) {
        return {
          id: socket.id,
          physicalSocket: socket.physicalSocket,
          state: socket.state,
          onTime: Utils.formatTime(socket.onTimeHour, socket.onTimeMinute),
          offTime: Utils.formatTime(socket.offTimeHour, socket.offTimeMinute),
          random: socket.random,
          randomBreaks: socket.randomBreaks
        }
      });
      next(viewSockets);
    });
  },
  addSocketFromView: function(socketVal, next) {
    var socket = {};
    socket.physicalSocket = parseInt(socketVal.physicalSocket, 10);
    socket.state = socketVal.state === 'on';
    socket.onTimeHour = parseInt(socketVal.onTime.slice(0, 2), 10);
    socket.onTimeMinute = parseInt(socketVal.onTime.slice(3, 5), 10);
    socket.offTimeHour = parseInt(socketVal.offTime.slice(0, 2), 10);
    socket.offTimeMinute = parseInt(socketVal.offTime.slice(3, 5), 10);
    socket.random = socketVal.random === 'on';
    socket.randomBreaks = socketVal.randomBreaks === 'on';
    SocketService.addSocket(socket, function(success) {
      next(success);
    });
  },
  modifySocketFromView: function(socketVal, next) {
    var socket = {};
    socket.physicalSocket = parseInt(socketVal.physicalSocket, 10);
    socket.state = socketVal.state === 'on';
    socket.onTimeHour = parseInt(socketVal.onTime.slice(0, 2), 10);
    socket.onTimeMinute = parseInt(socketVal.onTime.slice(3, 5), 10);
    socket.offTimeHour = parseInt(socketVal.offTime.slice(0, 2), 10);
    socket.offTimeMinute = parseInt(socketVal.offTime.slice(3, 5), 10);
    socket.random = socketVal.random === 'on';
    socket.randomBreaks = socketVal.randomBreaks === 'on';
    SocketService.modifySocket(socketVal.id, socket, function(success) {
      next(success);
    });
  }

};
