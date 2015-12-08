module.exports = {
  getSockets: function(next) {
    Socket.find().exec(function(err, sockets) {
      if(err) throw err;
      next(sockets);
    });
  },
  addSocket: function(socketVal, next) {
    Socket.create({value: socketVal}).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  },
  removeSocket: function(socketVal, next) {
    Socket.destroy({value: socketVal}).exec(function(err, socket) {
      if(err) throw err;
      next(socket);
    });
  }
};
