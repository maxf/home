/* global Utils, Socket */

var scheduledOn = function(schedule, time) {
  var i;
  var interval;
  for (i=0; i<schedule.length; i++) {
    interval = schedule[i];
    if (time >= interval.start && time <= interval.end) return true;
  }
  return false;
};

var schedule = [];

module.exports = {

  tick: function() {
    var now = new Date();
    sails.log(schedule);
    sails.log('SCHEDULER: tick at', now);
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets.forEach(function(socket) {
	sails.log('SCHEDULER: timed socket', socket);
	SocketService.modifySocket(socket.id, { switchedOn: scheduledOn(schedule[socket.id], now) } );	
      });
    });
  },

  // Compute a socket's schedule
  update: function(socketId, next) {
    Socket.find({id: socketId}).exec(function(err, socket) {
      if (socket.timerMode) {
	var s = [];
	var startTime = socket.startTime + (socket.random ? Math.random() * 600 - 300 : 0);
	var endTime = socket.endTime - (socket.random ? Math.random() * 600 - 300 : 0);
        var i;
        var breakStart;
        var breakEnd;

        s.push({start: Math.max(0, socket.startTime), end: Math.min(socket.endTime, 24*3600)});
	     
        if (socket.randomBreaks) {
          for (i=0; i<10; i++) {
  	    breakStart = Math.random()*24*3600;
	    breakEnd = Max(breakStart + Math.random()*600, 24*3600);
	    s.push({start: breakStart, end: breakEnd});
	  }
        }
      }
      schedule[socketId] = s;
      next && next(schedule[socketId]);
    });
  }
};
