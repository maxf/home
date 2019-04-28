const request = require('request-promise-native');
require('dotenv').config();

module.exports = {

  friendlyName: 'energenie',


  description: 'send on/off commands to the energenie api',


  inputs: {

    id: {
      type: 'string',
      example: '23',
      description: 'The Identifier of the switch',
      required: true
    },

    onOrOff: {
      type: 'string',
      example: 'on',
      description: '"on" to turn the switch on, "off" to turn off',
      required: true
    }

  },


  fn: async function (inputs, exits) {
    const apiUrl = `${process.env.SWITCH_API}/set_switch/${inputs.id}/${inputs.onOrOff}`;
    await request.get(apiUrl);
    // do it twice as it sometimes misses
    await request.get(apiUrl);
    return exits.success();
  }

};
