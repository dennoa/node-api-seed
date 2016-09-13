'use strict';

const _ = require('lodash');
const apiKey = require('../../components/api-key');
const commonRequestValidator = require('../../components/request-validator');
const searchControls = require('../../components/search-controls');

const commonRules = {
  dateFrom: commonRequestValidator.schema.optionalDate,
  dateTo: commonRequestValidator.schema.optionalDate,
  isAdmin: commonRequestValidator.schema.optionalBoolean
};

const createRules = _.merge({
  key: { optional: true, isApiKeyAvailable: { errorMessage: commonRequestValidator.errorMessages.unavailable }}
}, commonRules);

const updateRules =_.merge({ key: commonRequestValidator.schema.requiredString }, commonRules);

const findRules = _.merge({}, commonRules, searchControls.validationRules);

function prepare(options) {
  return commonRequestValidator.prepare({
    customValidators: {
      isApiKeyAvailable: key => new Promise((resolve, reject) => {
        if (!key) { return reject(); }
        apiKey.get({ key: key }).then(reject, resolve);
      })
    }
  });
}

module.exports = {
  createRules: createRules,
  updateRules: updateRules,
  findRules: findRules,
  prepare: prepare,
  validate: commonRequestValidator.validate
};
