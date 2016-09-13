'use strict';

const _ = require('lodash');
const user = require('../../components/user');
const commonRequestValidator = require('../../components/request-validator');
const searchControls = require('../../components/search-controls');

const findRules = _.merge({
  isAdmin: commonRequestValidator.schema.optionalBoolean,
  since: commonRequestValidator.schema.optionalDate
}, searchControls.validationRules);

const createRules = {
  username: { isUsernameAvailable: { errorMessage: commonRequestValidator.errorMessages.unavailable }},
  password: commonRequestValidator.schema.requiredString,
  email: commonRequestValidator.schema.requiredString,
  name: commonRequestValidator.schema.requiredString,
  isAdmin: commonRequestValidator.schema.optionalBoolean
};

const updateRules = {
  username: commonRequestValidator.schema.requiredString,
  isAdmin: commonRequestValidator.schema.optionalBoolean
};

function prepare(options) {
  return commonRequestValidator.prepare({
    customValidators: {
      isUsernameAvailable: username => new Promise((resolve, reject) => {
        if (!username) { return reject(); }
        user.get({ username: username }).then(reject, resolve);
      })
    }
  });
}

module.exports = {
  findRules: findRules,
  createRules: createRules,
  updateRules: updateRules,
  prepare: prepare,
  validate: commonRequestValidator.validate
};
