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
     SocketService.getSockets(function(sockets) {
       res.view('sockets', {
         sockets: sockets
       });
     });
   }
};
