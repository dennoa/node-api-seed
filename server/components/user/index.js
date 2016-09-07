'use strict';

const User = require('./user.model');

function findByUsername(username, callback) {
  User.findOne({ username: username }, callback);
}

module.exports = {
  findByUsername: findByUsername
};