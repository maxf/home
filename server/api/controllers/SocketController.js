/**
 * SocketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const defaultActionsPath = '../../node_modules/sails/lib/hooks/blueprints/actions/';

const defaultAdd = require(defaultActionsPath+'add.js'); // PUT
const defaultCreate = require(defaultActionsPath+'create.js'); // POST
const defaultReplace = require(defaultActionsPath+'replace.js'); // PUT
const defaultUpdate = require(defaultActionsPath+'update.js'); // PATCH
const defaultDestroy = require(defaultActionsPath+'destroy.js'); // DELETE


module.exports = {
  add: async function (req, res) {
    return defaultAdd(req, res);
  },
  create: async function (req, res) {
    return defaultCreate(req, res);
  },
  update: async function (req, res) {
    return defaultUpdate(req, res);
  },
  replace: async function (req, res) {
    return defaultReplace(req, res);
  },
  destroy: async function (req, res) {
    return defaultDestroy(req, res);
  },
  setSwitch: async function (req, res) {
    const socket = await Socket.findOne({physicalSocket: req.param('device_id')});
    if (socket) {
      await sails.helpers.setSwitch(socket.physicalSocket, req.param('state'));
      await Socket.updateOne({physicalSocket: req.param('device_id')})
        .set({ requestedSwitchedOn: req.param('state') === 'on' });
      return res.send('ok');

    } else {
      sails.log('Error, didn\'t find switch with id: ' + req.param('device_id'));
      return res.send('err');
    }
  }
};
