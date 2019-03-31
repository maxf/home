/**
 * ReceiverController
 *
 * @description :: Server-side actions for handling incoming requests from the receiver
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  ping: async function (req, res) {
    const message = req.body;
    const sensorId = message.header.sensorid;
    const state = message.recs
      .filter(rec => rec.paramname === 'SWITCH_STATE');

    if (state.length === 1) {
      const updatedSocket = await Socket.updateOne({physicalSocket: sensorId})
        .set({
          switchedOn: state[0].value !== 0,
          lastMessageReceived: Date.now()
        });

      if (!updatedSocket) {
        sails.log('failed to find and update socket ' + sensorId);
      } else {
        sails.log('updated socket' + sensorId);
        sails.sockets.broadcast('updates', 'ping', { deviceId: sensorId }, req);
      }

    } else {
      console.log(`switch ${sensorId} has no single SWITCH_STATE`);
    }
    return res.json(message);
  },

  subscribe: async function (req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }
    sails.sockets.join(req, 'updates');
    return res.ok();
  }


};

/* payload

{
  "header": {
    "sensorid": 10404,
    "productid": 2,
    "encryptPIP": 26989,
    "mfrid": 4
  },
  "type": "OK",
  "rxtimestamp": 1553106957.230103,
  "recs": [
    {
      "paramunit": "W",
      "typeid": 128,
      "valuebytes": [
        0,
        56
      ],
      "value": 56,
      "length": 2,
      "wr": false,
      "paramname": "REAL_POWER",
      "paramid": 112
    },
    {
      "paramunit": "VAR",
      "typeid": 128,
      "valuebytes": [
        0,
        0
      ],
      "value": 0,
      "length": 2,
      "wr": false,
      "paramname": "REACTIVE_POWER",
      "paramid": 113
    },
    {
      "paramunit": "V",
      "typeid": 0,
      "valuebytes": [
        237
      ],
      "value": 237,
      "length": 1,
      "wr": false,
      "paramname": "VOLTAGE",
      "paramid": 118
    },
    {
      "paramunit": "Hz",
      "typeid": 32,
      "valuebytes": [
        49,
        230
      ],
      "value": 49.8984375,
      "length": 2,
      "wr": false,
      "paramname": "FREQUENCY",
      "paramid": 102
    },
    {
      "paramunit": "",
      "typeid": 0,
      "valuebytes": [
        1
      ],
      "value": 1,
      "length": 1,
      "wr": false,
      "paramname": "SWITCH_STATE",
      "paramid": 115
    }
  ]
}
 */
