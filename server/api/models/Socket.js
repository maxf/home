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
      type: 'integer',
      required: true
    },
    timerMode: {
      type: 'boolean',
      required: true,
      defaultsTo: false,
    },
    switchedOn: {
      type: 'boolean', // True: the socket is on. Else it's off
      required: false,
      defaultsTo: false
    },
    startTime: { // when the socket gets switched on (in minutes after midnight)
      type: 'integer',
      required: true
    },
    stopTime: { // when the socket gets switched off (in minutes after midnight)
      type: 'integer',
      required: true
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
    }
  }
};
