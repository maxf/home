/**
 * ReceiverController
 *
 * @description :: Server-side actions for handling incoming requests from the receiver
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const extractValues = function(payload) {
  const result = { lastMessageReceived: Date.now() };
  payload.map(record => {
    switch (record.paramname) {
      case 'SWITCH_STATE': result.switchedOn = record.value !== 0; break;
      case 'REAL_POWER': result.realPower = record.value; break;
      case 'REACTIVE_POWER': result.reactivePower = record.value; break;
      case 'FREQUENCY': result.frequency = record.value; break;
      case 'VOLTAGE': result.voltage = record.value; break;
    }
  });
  return result;
};

module.exports = {
  ping: async function (req, res) {
    const message = req.body;
    const deviceId = message.header.sensorid.toString();
    const records = extractValues(message.recs);
    const updatedSocket = await Socket.updateOne({physicalSocket: deviceId})
      .set(records);
    sails.log(`message from ${deviceId}`);
    if (!updatedSocket) {
      sails.log('failed to find and update socket ' + deviceId);
    } else {
      const payload = { deviceId, records };
      sails.sockets.broadcast('updates', 'ping', payload, req);

/*
      if (updatedSocket.requestedSwitchedOn !== updatedSocket.switchedOn) {
        console.log(`retrying socket ${updatedSocket.description}`, updatedSocket.requestedSwitchedOn, updatedSocket.switchedOn);
        await sails.helpers.setSwitch(updatedSocket.physicalSocket, updatedSocket.requestedSwitchedOn ? 'on' : 'off');
      }
*/
    }

    return res.json(records);
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
