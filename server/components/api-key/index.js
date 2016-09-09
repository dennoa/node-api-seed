'use strict';

const uuid = require('uuid');
const _ = require('lodash');
const ApiKey = require('./api-key.model');
const logger = require('../logger');
const requestHeaderKey = 'x-iag-api-key'; 

function findValid(key) {
  let now = new Date();
  var conditions = { 
    key: key, 
    dateFrom: { $lte: now }, 
    $or: [{
      dateTo: { $gte: now }
    },{
      dateTo: { $exists: false }
    }]
  };
  return ApiKey.findOne(conditions).exec();
}

function notAuthorized(res) {
  return res.status(401).send();
}

function validate(options) {
  let opts = options || {};

  function matchesOptions(doc) {
    return _.reduce(opts, (result, value, key) => {
      return result && (_.get(doc, key) === value);
    }, true);
  }

  return (req, res, next) => {
    let key = req.get(requestHeaderKey);
    if (typeof key === 'undefined' || key === null) { return notAuthorized(res); }
    findValid(key).then(doc => {
      if (doc && matchesOptions(doc)) { return next(); }
      return notAuthorized(res);
    }, next);
  };
}

function create(doc) {
  return ApiKey.create(_.merge({ key: uuid.v4() }, doc));
}

function get(key) {
  return new Promise((resolve, reject) => {
    ApiKey.findOne({ key: key }).exec().then(existing => {
      if (!existing) { return reject(); }
      resolve(existing);
    }, reject);
  });
}

function update(doc) {
  return new Promise((resolve, reject) => {
    get(doc.key).then(existing => {
      _.merge(existing, doc).save(err => {
        if (err) { return reject(err); }
        resolve(existing);
      });
    }, reject);
  });
}

function remove(key) {
  return new Promise((resolve, reject) => {
    get(key).then(existing => {
      existing.remove(err => {
        if (err) { return reject(err); }
        resolve();
      });
    }, reject);
  });
}

function find(conditions) {
  return ApiKey.find(conditions);
}

function logKeyCreationError(err) {
  logger.error('Failed to create an api key', err);
}

function ensureAnAdminApiKeyIsAvailable() {
  return ApiKey.findOne({ isAdmin: true }).exec().then(doc => {
    if (!doc) { create({ isAdmin: true }).catch(logKeyCreationError); }
  }, logKeyCreationError);
}

module.exports = {
  validate: validate,
  create: create,
  update: update,
  get: get,
  remove: remove,
  find: find,
  requestHeaderKey: requestHeaderKey,
  ensureAnAdminApiKeyIsAvailable: ensureAnAdminApiKeyIsAvailable
};