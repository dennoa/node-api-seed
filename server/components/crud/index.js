'use strict';

const _ = require('lodash');

module.exports = options => {

  function create(doc) {
    return options.model.create(_.merge({}, options.defaultValues(), doc));
  }

  function find(conditions) {
    return options.model.find(conditions);
  }

  function get(keyConditions) {
    return new Promise((resolve, reject) => {
      options.model.findOne(keyConditions).exec().then(existing => {
        if (!existing) { return reject(); }
        resolve(existing);
      }, reject);
    });
  }

  function update(doc) {
    return new Promise((resolve, reject) => {
      get(options.keyConditions(doc)).then(existing => {
        _.merge(existing, doc).save(err => {
          if (err) { return reject(err); }
          resolve(existing);
        });
      }, reject);
    });
  }

  function remove(keyConditions) {
    return new Promise((resolve, reject) => {
      get(keyConditions).then(existing => {
        existing.remove(err => {
          if (err) { return reject(err); }
          resolve();
        });
      }, reject);
    });
  }

  return {
    create: create,
    find: find,
    get: get,
    update: update,
    remove: remove
  };
};
