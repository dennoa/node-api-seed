'use strict';

const User = require('./user.model');

function findByUsername(username, callback) {
  User.findOne({ username: username }, callback);
}

function findByUserId(type, id, callback) {
  let conditions = {};
  conditions['ids.' + type] = id;
  User.findOne(conditions, callback);
}

module.exports = {
  findByUsername: findByUsername,
  findByUserId: findByUserId
};