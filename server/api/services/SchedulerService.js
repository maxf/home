/* global Utils, Socket, sails */

var Utils = require('./utils');

var scheduledOn = function(schedule, time) {
  var i;
  var interval;
  var keys = Object.keys(schedule);
  if (keys) {
    for (i=0; i<keys.length; i++) {
      interval = schedule[keys[i]];
      if (time >= interval.start && time <= interval.stop) {
        return true;
      }
    }
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
    s.push({start: Math.max(0, startTimeMins), stop: Math.min(stopTimeMins, 24*60)});
    if (socket.randomBreaks) {
      for (i=0; i<10; i++) {
        breakStartMins = Math.random()*24*60;
        breakStopMins = Math.min(breakStartMins + 1 + Math.random()*19, 24*60);
        s.push({start: breakStartMins, stop: breakStopMins});
      }
    }
  }
  return s;
}

var tick = function() {
  var now = new Date();
  var nowMins = now.getHours()*60 + now.getMinutes();
  sails.log('SCHEDULER: tick at', now, nowMins);
  Socket.find({timerMode: true}).exec(function(err, sockets) {
    sockets.forEach(function(socket) {
      var updatedSocket = socket;
      updatedSocket.switchedOn =  scheduledOn(schedule[socket.id], nowMins);
      SocketService.modifySocket(socket.id, updatedSocket );
    });
  });
}

module.exports = {

  tick: tick,

  scheduledToBeOn: function(socketId) {
    var now = new Date();
    var nowMins = now.getHours()*60 + now.getMinutes();
    return scheduledOn(schedule[socketId], nowMins);
  },

  // Compute a socket's schedule
  update: function(socket) {
    sails.log('SCHEDULER: update socket', socket.description);
    schedule[socket.id] = buildSchedule(socket);
  },

  updateAll: function(next) {
    Socket.find({timerMode: true}).exec(function(err, sockets) {
      sockets.forEach(function(socket) {
        schedule[socket.id] = buildSchedule(socket);
      });
      tick();
      next && next(sockets);
    });
  },

  getSchedules: function() {
    return schedule;
  },

  getScheduleText: function(id) {
    var r;
    if (id in schedule) {
      r = schedule[id].map(function(segment) {
        return Utils.minsToString(segment.start) + ' - ' + Utils.minsToString(segment.stop);
      });
      r.sort();
    } else r = [];
    return r;
  }

};