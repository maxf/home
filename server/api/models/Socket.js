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
    onTimeHour: {
      type: 'integer',
      required: true
    },
    onTimeMinute: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    },
    offTimeHour: {
      type: 'integer',
      required: true
    },
    offTimeMinute: {
      type: 'integer',
      required: false,
      defaultsTo: 0
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
