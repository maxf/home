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

    function sendView(res) {
     SocketService.getSocketsForView(function(socketsForView) {
       res.view('sockets', {
         sockets: socketsForView
       });
     });
    }

    if (req.route.method === 'post') {
      sails.log(req.route.method);
      sails.log(req.body);
      // Either an existing socket was modified, or a new one was created
      if (req.body.id) {
        // Updating existing socket
        sails.log('updating socket ' + req.body.id);
      } else {
        // Create a new socket
        SocketService.addSocketFromView(req.body, function(success) {
          if (!success) throw 'Failed to add socket';
          sendView(res);
        });
      }
    } else {
      sendView(res);
    }
  }
};
