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
      // Either an existing socket was modified, or a new one was created
      if (req.body.id) {
        SocketService.modifySocketFromView(req.body, function(success) {
          if (!success) throw 'Failed to modify socket';
          sendView(res);
        });
      } else {
        if (req.body.delete_id) {
          SocketService.removeSocket(req.body.delete_id, function(success) {
            if (!success) throw 'Failed to delete socket';
            sendView(res);
          });
        } else {
          // Create a new socket
          SocketService.addSocketFromView(req.body, function(success) {
            if (!success) throw 'Failed to add socket';
            sendView(res);
          });
        }
      }
    } else {
      sendView(res);
    }
  }
};
