'use strict';

const apiKey = require('../../components/api-key');
const commonRequestValidator = require('../../components/request-validator');

const commonRules = {
  dateFrom: commonRequestValidator.schema.optionalDate,
  dateTo: commonRequestValidator.schema.optionalDate,
  isAdmin: commonRequestValidator.schema.optionalBoolean
};

function prepare(options) {
  return commonRequestValidator.prepare({
    customValidators: {
      isApiKeyAvailable: key => new Promise((resolve, reject) => {
        if (!key) { return reject(); }
        apiKey.get(key).then(reject, resolve);
      })
    }
  });
}

module.exports = {
  commonRules: commonRules,
  prepare: prepare
};
