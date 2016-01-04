/* global Socket, SocketService, sails */

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

(function () {

  var request = require('request');
  var switchTimeouts = [];

  function secs(h, m, s) {
    return h*3600+m*60+s;
  }

  // switch a socket on or off, possibly after a delay if socket is random
  function setSocket(socket, switchedOn) {
    var delaySecs = socket.random ? Math.random() * 600 : 0
    sails.log('SCHEDULER: socket "' + socket.description + '" switch ' + switchedOn + ' at ' + new Date() + ' + ' + delaySecs);
    switchTimeouts[socket.id] = setTimeout(function() {
      sails.log('SCHEDULER: switching socket "' + socket.description + '" now. ', new Date());
      SocketService.modifySocket(socket.id, {switchedOn: switchedOn});
      delete switchTimeouts[socket.id];
    }, delaySecs*1000);
  }

  function tick() {
    var now = new Date();
    var timeNow = secs(now.getHours(), now.getMinutes(), now.getSeconds());
    sails.log('SCHEDULER: tick at', now, timeNow);
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets
        .filter(function(s) { return !switchTimeouts[s.id]; })
        .forEach(function(socket) {
          var startTime = socket.startTime * 60;
          var endTime = socket.stopTime * 60;

          // if the socket is on and we're in off hours, turn it off
          // (before turning it off, if random, then wait rnd seconds)
          if (socket.switchedOn && (timeNow < startTime || timeNow > endTime)) {
            setSocket(socket, false);
          } else {
            // if the socket is off and we're in on hours, turn it on
            if (!socket.switchedOn && timeNow > startTime && timeNow < endTime) {
              setSocket(socket, true);
            }
          }
        })
      ;
    });

    // Sockets with random breaks
    Socket.find({randomBreaks: true}).exec(function(err, sockets) {
      sockets
        .filter(function(s) { return !switchTimeouts[s.id]; })
        .forEach(function(socket) {
          // is this socket in its off period?
          if (timeNow < socket.startTime*60 || timeNow > socket.stopTime*60) {
            // yes, so roll a dice
            if (Math.random() > .9) {
              // win! Let's turn on, wait a bit, then off
              sails.log('SCHEDULER: random break at "' + socket.description + '"');
              setSocket(socket, true);
              switchTimeouts[socket.id] = setTimeout(function() {
                setSocket(socket, false);
                delete switchTimeouts[socket.id];
              }, 50000 + Math.random()*120*1000);
            }
          }
        })
      ;
    });
  }

  module.exports.bootstrap = function(cb) {
    setTimeout(function() {
      if (sails.config.globals.socketsApiUrl) {
        sails.log('Starting scheduler. Sockets URL is ',
                  sails.config.globals.socketsApiUrl);
        setInterval(tick, 60000);
      } else {
        sails.log('Warning: SOCKETS_API_URL environment variable not defined. Not starting the scheduler');
      }
    }, 3000);

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  };
}());
