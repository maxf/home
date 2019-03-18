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
const request = require('request-promise-native');


const updateSwitch = async function(id, state) {
  const onOrOff = state === 'true' ? 'on' : 'off';
  const apiUrl = `http://192.168.0.3:5000/set_switch/${id}/${onOrOff}`;
  console.log(`sending "${onOrOff}" to switch ${id}`);
  try {
    await request.get(apiUrl);
  } catch (e) {
    console.log(`error, the socket API returned an error: ${e}`);
  }
};

module.exports = {
  add: async function (req, res) {
    return defaultAdd(req, res);
  },
  create: async function (req, res) {
    return defaultCreate(req, res);
  },
  update: async function (req, res) {
    updateSwitch(req.body.physicalSocket, req.body.switchedOn);
    return defaultUpdate(req, res);
  },
  replace: async function (req, res) {
    return defaultReplace(req, res);
  },
  destroy: async function (req, res) {
    return defaultDestroy(req, res);
  }
};
