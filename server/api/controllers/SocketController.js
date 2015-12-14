/**
 * SocketController
 *
 * @description :: Server-side logic for managing sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global SocketService, module */

module.exports = {
  getSockets: function(req, res) {
    SocketService.getSockets(function(sockets) {
      res.json(sockets);
    });
  },
  addSocket: function(req, res) {
    var socketVal = (req.body.value) ? req.body.value : undefined;
    SocketService.addSocket(socketVal, function(success) {
      res.json(success);
    });
  },
  removeSocket: function(req, res) {
    var socketVal = (req.body.value) ? req.body.value : undefined;
    SocketService.removeSocket(socketVal, function(success) {
      res.json(success);
    });
  },


  socketsPage: function(req, res) {
    console.log(req.route.method);
    if (req.route.method === 'post') {
      // Either an existing socket was modified, or a new one was created
      console.log(req.body);
      if (req.params.id) {
        // Updating existing socket
        console.log('updating socket ' + req.params.id);
      } else {
        // Create a new socket
        SocketService.addSocketFromView(req.body, function(success) {
          if (!success) throw 'Failed to add socket';
          SocketService.getSocketsForView(function(socketsForView) {
            res.view('sockets', {
              sockets: socketsForView
            });
          });
        });
      }
    }
    SocketService.getSocketsForView(function(socketsForView) {
      res.view('sockets', {
        sockets: socketsForView
      });
    });
  }
};
