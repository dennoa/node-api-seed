'use strict';

const uuid = require('uuid');
const _ = require('lodash');
const ApiKey = require('./api-key.model');

const crud = require('../crud')({
  model: ApiKey,
  keyConditions: (doc => { return { key: doc.key }; }),
  defaultValues: () => { return { key: uuid.v4() }; }
});

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
    if (!key) { return notAuthorized(res); }
    findValid(key).then(doc => {
      if (doc && matchesOptions(doc)) { return next(); }
      return notAuthorized(res);
    }, next);
  };
}

function ensureAnApiKeyIsAvailable(conditions) {
  return new Promise((resolve, reject) => {
    ApiKey.findOne(conditions).exec().then(doc => {
      if (doc) { return resolve(doc); }
      crud.create(conditions).then(resolve, reject); 
    }, reject);
  });
}

module.exports = _.merge({
  validate: validate,
  requestHeaderKey: requestHeaderKey,
  ensureAnApiKeyIsAvailable: ensureAnApiKeyIsAvailable
}, crud);