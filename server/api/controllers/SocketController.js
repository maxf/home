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
const request = require('request-promise-native');


module.exports = {
  add: async function (req, res) {
    try {
      await request.get('http://localhost:5000/set_switch/0/on');
    } catch (e) {
      console.log(`error, the socket API returned an error: ${e}`);
    }
    return defaultAdd(req, res);
  },
  create: async function (req, res) {
    return defaultCreate(req, res);
  },
  update: async function (req, res) {
    try {
      await request.get('http://localhost:5000/set_switch/0/on');
    } catch (e) {
      console.log(`error, the socket API returned an error: ${e}`);
    }
    return defaultUpdate(req, res);
  },
  replace: async function (req, res) {
    return defaultReplace(req, res);
  }
};
