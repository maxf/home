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

  function tick() {
    var now = new Date();
    var timeNow = secs(now.getHours(), now.getMinutes(), now.getSeconds());
    sails.log('tick at', now, timeNow);
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets.forEach(function(socket) {
        var startTime = socket.startTime * 60;
        var endTime = socket.stopTime * 60;
        var waitingTime = socket.random ? Math.random() * 100000 : 0;

        // if the socket is on and we're in off hours, turn it off
        // (before turning it off, if random, then wait rnd seconds)
        if (socket.switchedOn && (timeNow < startTime || timeNow > endTime)) {
          sails.log('Socket switch', timeNow, startTime, endTime);
          sails.log('waiting ', waitingTime + 'ms');
          SocketService.modifySocket(socket.id, {switchedOn: false});

          // markSocket(socket, true, function () {
          //   setTimeout(function() {
          //     SocketService.update(socket.id, {switchedOn: true});
          //   }, waitingTime);
          // });
        } else {

          // if the socket is off and we're in on hours, turn it on
          if (!socket.switchedOn && timeNow > startTime && timeNow < endTime) {
            sails.log('Socket switch', timeNow, startTime, endTime);
            sails.log('waiting ', waitingTime + 'ms');
            // markSocket(socket, false, function() {
            //   setTimeout(function() { setSocket(socket, false) }, waitingTime);
            // });
            SocketService.modifySocket(socket.id, {switchedOn: true});
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
      if (sails.config.globals.socketsApiUrl) {
        sails.log('Starting scheduler. Sockets URL is ',
                  sails.config.globals.socketsApiUrl);
        setInterval(tick, 10000);
      } else {
        sails.log('Warning: SOCKETS_API_URL environment variable not defined. Not starting the scheduler');
      }
    }, 3000);

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  };
}());
