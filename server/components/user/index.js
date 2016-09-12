'use strict';

const _ = require('lodash');
const User = require('./user.model');

function idConditions(doc) {
  return _.reduce(doc.ids, (conditions, value, key) => {
    conditions['ids.' + key] = value;
  }, {});
}

module.exports = require('../crud')({
  model: User,
  keyConditions: (doc => { 
    return (doc.username) ? { username: doc.username } : idConditions(doc);
  }),
  defaultValues: () => null
});
