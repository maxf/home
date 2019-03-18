/**
 * ReceiverController
 *
 * @description :: Server-side actions for handling incoming requests from the receiver
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  ping: async function (req, res) {
    const message = req.body;
    console.log(`received message from unit ${message.header.sensorid}`);
    return res.json({ 'ok': 'yay'});
  }
};
