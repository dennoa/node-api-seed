'use strict';

const _ = require('lodash');
const apiKey = require('../../components/api-key');

module.exports = {
  getAccessInfo: req => new Promise(resolve => resolve({})),
  validate: (accessInfo, pathOptions) => new Promise((resolve, reject) => {
    if (!accessInfo) { return reject(); }
    if (!pathOptions) { return resolve(); }
    let isValid = _.reduce(pathOptions, (result, value, key) => {
      return result && (_.get(accessInfo, key) === value);
    }, true);
    if (isValid) { return resolve(); }
    return reject();
  }),
  reslocal: 'accessControl'
};