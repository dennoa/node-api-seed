'use strict';

const _ = require('lodash');
const crud = require('cruddy-express-api');
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

const crudModel = crud.model({
  model: User,
  getKeyConditions: (doc => { 
    return (doc.username) ? { username: doc.username } : idConditions(doc);
  })
});

function createWithPassword(doc) {
  return crudModel.create(_.merge({ passwordHash: hashPassword(doc.password) }, doc));
}

module.exports = _.merge({}, crudModel, {
  setHashPassword: setHashPassword,
  create: createWithPassword
});