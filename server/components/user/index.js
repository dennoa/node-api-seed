'use strict';

const User = require('./user.model');

function findByUsername(username, callback) {
  User.findOne({ username: username }, callback);
}

function uniqueKeyConditions(typeOrUsername, id) {
  if (typeof id === 'undefined') {
    return { username: typeOrUsername };
  }
  let conditions = {};
  conditions['ids.' + type] = id;
  return conditions;
}

function get(typeOrUsername, id) {
  return new Promise((resolve, reject) => {
    User.findOne(uniqueKeyConditions(typeOrUsername, id)).exec().then(existing => {
      if (!existing) { return reject(); }
      resolve(existing);
    }).catch(reject);
  });
}

function create(doc) {
  return User.create(doc);
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
  return User.find(conditions);
}

module.exports = {
  get: get
};