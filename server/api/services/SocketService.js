module.exports = {
  getSockets: function(next) {
    Socket.find().exec(function(err, sockets) {
      if(err) throw err;
      next(sockets);
    });
  },
  addSocket: function(socketVal, next) {
    sails.log('add socket');
    sails.log(socketVal)
    Socket.create(socketVal).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  },
  removeSocket: function(socketVal, next) {
    Socket.destroy({value: socketVal}).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  },

  getSocketsForView: function(next) {
    Socket.find().exec(function(err, sockets) {
      var viewSockets;
      if (err) throw err;
      viewSockets = sockets.map(function(socket) {
        return {
          id: socket.id,
          state: socket.state,
          timeOn: Utils.formatTime(socket.onTimeHour, socket.onTimeMinute),
          timeOff: Utils.formatTime(socket.offTimeHour, socket.offTimeMinute),
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
  }

};
