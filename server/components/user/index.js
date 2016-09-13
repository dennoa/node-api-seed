'use strict';

const _ = require('lodash');
const User = require('./user.model');

let hashPassword;
function setHashPassword(fn) {
  hashPassword = fn;
}

function idConditions(doc) {
  return _.transform(doc.ids, (conditions, value, key) => {
    conditions['ids.' + key] = value;
  }, {});
}

const crud = require('../crud')({
  model: User,
  getKeyConditions: (doc => { 
    return (doc.username) ? { username: doc.username } : idConditions(doc);
  })
});

function createWithPassword(doc) {
  return crud.create(_.merge({ passwordHash: hashPassword(doc.password) }, doc));
}

module.exports = _.merge({}, crud, {
  setHashPassword: setHashPassword,
  create: createWithPassword
});