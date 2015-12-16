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

    if (req.route.method === 'post') {
      if (req.body.id) {
        SocketService.modifySocketFromView(req.body, function(success) {
          if (!success) throw 'Failed to modify socket';
          res.redirect('/sockets/')
        });
      } else {
        if (req.body.delete_id) {
          SocketService.removeSocket(req.body.delete_id, function(success) {
            if (!success) throw 'Failed to delete socket';
            res.redirect('/sockets/')
          });
        } else {
          SocketService.addSocketFromView(req.body, function(success) {
            if (!success) throw 'Failed to add socket';
            res.redirect('/sockets/')
          });
        }
      }
    } else {
      SocketService.getSocketsForView(function(socketsForView) {
        res.view('sockets', {
          sockets: socketsForView
        });
      });
    }
  }
};
