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

function validate(req) {
  return new Promise((resolve, reject)=> {
    let key = req.get(requestHeaderKey);
    if (!key) { return reject(); }
    findValid(key).then((doc)=> {
      return (doc) ? resolve(doc) : reject();
    }, reject);
  });
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