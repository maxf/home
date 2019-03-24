/**
 * ReceiverController
 *
 * @description :: Server-side actions for handling incoming requests from the receiver
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  ping: async function (req, res) {
    const payload = req.body;
    console.log('received ping', req.body);
    return res.json({ 'ok': 'yay'});
  }
};
