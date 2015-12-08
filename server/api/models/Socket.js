/**
* Socket.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    onTimeHour: {
      type: 'integer',
      required: true
    },
    onTimeMinute: {
      type: 'integer',
      required: true
    },
    offTimeHour: {
      type: 'integer',
      required: true
    },
    offTimeMinute: {
      type: 'integer',
      required: true
    },
    random: {
      type: 'boolean',
      required: true
    },
    randomBreaks: {
      type: 'boolean',
      required: true
    }
  }
};
