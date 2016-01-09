/* global Utils, Socket */

var scheduledOn = function(schedule, time) {
  var i;
  var interval;
  var keys = Object.keys(schedule);
  for (i=0; i<keys.length; i++) {
    interval = schedule[keys[i]];
    if (time >= interval.start && time <= interval.end) return true;
  }
  return false;
};

var schedule = {};

var buildSchedule = function(socket) {
  var s = [];
  if (socket.timerMode) {
    var startTimeMins = socket.startTime + (socket.random ? Math.random() * 10 - 5 : 0);
    var stopTimeMins = socket.stopTime - (socket.random ? Math.random() * 10 - 5 : 0);
    var i;
    var breakStartMins;
    var breakStopMins;
//    sails.log('---', socket.id, '---');
//    sails.log(socket);
    s.push({start: Math.max(0, startTimeMins), stop: Math.min(stopTimeMins, 24*60)});
//    sails.log('startTime:',startTimeMins);
//    sails.log('stopTime:',stopTimeMins);
//    sails.log(0,s);
    if (socket.randomBreaks) {
      for (i=0; i<10; i++) {
  	breakStartMins = Math.random()*24*60;
	breakStopMins = Math.min(breakStartMins + Math.random()*20, 24*60);
	s.push({start: breakStartMins, stop: breakStopMins});
//	sails.log(i, s);
      }
    }
//    sails.log('---------');
  }
  return s;
}

module.exports = {

  tick: function() {
    var now = new Date();
    sails.log(schedule);
    sails.log('SCHEDULER: tick at', now);
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets.forEach(function(socket) {
	SocketService.modifySocket(socket.id, { switchedOn: scheduledOn(schedule[socket.id], now) } );	
      });
    });
  },

  // Compute a socket's schedule
  update: function(socket) {
    sails.log('SCHEDULER: update', socket.id);
    schedule[socket.id] = buildSchedule(socket);
  },

  updateAll: function(next) {
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets.forEach(function(socket) {
	schedule[socket.id] = buildSchedule(socket);
      });
      next && next(sockets);
    });
  },

  getSchedules: function() {
    return schedule;
  }

};
