/**
* Socket.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    description: {
      type: 'string',
      required: false,
      defaultsTo: ''
    },
    physicalSocket: {
      type: 'string',
      required: false,
      defaultsTo: ''
    },
    timerMode: {
      type: 'boolean',
      required: false,
      defaultsTo: false
    },
    switchedOn: {
      type: 'boolean', // True: the socket is on. Else it's off
      required: false,
      defaultsTo: false
    },
    realPower: {
      type: 'number',
      defaultsTo: 0,
      required: false
    },
    startTime: { // when the socket gets switched on (in minutes after midnight)
      type: 'number',
      defaultsTo: 0,
      required: false
    },
    stopTime: { // when the socket gets switched off (in minutes after midnight)
      type: 'number',
      defaultsTo: 24*60,
      required: false
    },
    random: {
      type: 'boolean',
      required: false,
      defaultsTo: true
    },
    randomBreaks: {
      type: 'boolean',
      required: false,
      defaultsTo: true
    },
    lastMessageReceived: {
      type: 'string',
      columnType: 'bigint',
      required: false
    }
  }
};
