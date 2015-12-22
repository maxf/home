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

  function secs(h, m, s) {
    return h*3600+m*60+s;
  }

  function markSocket(socket, turnOff, next) {
    SocketService.modifySocket(socket.id, {switchedOn: !turnOff}, next);
  }

  function setSocket(socket, turnOff) {
    var url = sails.config.globals.socketsApiUrl + socket.physicalSocket +
      '/' + (turnOff ? 'off' : 'on');
    sails.log('Sending: ', url);

    request(url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        sails.log('An error occurred when setting a socket: ', url);
      }
    });
  }

  function tick() {
    var now = new Date();
    var timeNow = secs(now.getHours(), now.getMinutes(), now.getSeconds());
    sails.log('tick at', timeNow);
    Socket.find().exec(function(err, sockets) {
      sockets.forEach(function(socket) {
        var startTime = secs(socket.onTimeHour, socket.onTimeMinute, 0);
        var endTime = secs(socket.offTimeHour, socket.offTimeMinute, 0);
        var waitingTime = socket.random ? Math.random() * 100000 : 0;

        // if the socket is on and we're in off hours, turn it off
        // (before turning it off, if random, then wait rnd seconds)
        if (socket.switchedOn && (timeNow < startTime || timeNow > endTime)) {
          sails.log('Socket switch', timeNow, startTime, endTime);
          sails.log('waiting ', waitingTime + 'ms');
          markSocket(socket, true, function () {
            setTimeout(function() { setSocket(socket, true) }, waitingTime);
          });
        } else {

          // if the socket is off and we're in on hours, turn it on
          if (!socket.switchedOn && timeNow > startTime && timeNow < endTime) {
            sails.log('Socket switch', timeNow, startTime, endTime);
            sails.log('waiting ', waitingTime + 'ms');
            markSocket(socket, false, function() {
              setTimeout(function() { setSocket(socket, false) }, waitingTime);
            });
          }
        }
      });

      // if the socket is on and it's on hours and randomBreaks
      // turn it on and off for a minute
      // TODO

    });
  }

  module.exports.bootstrap = function(cb) {
    setTimeout(function() {
      if (sails.config.globals.socketApiUrl) {
        sails.log('Starting scheduler. Sockets URL is ',
                  sails.config.globals.socketApiUrl);
        setInterval(tick, 10000);
      } else {
        sails.log('Warning: SOCKETS_API_URL environment variable not defined. Not starting the scheduler');
      }
    }, 5000);

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  };
}());
