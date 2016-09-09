'use strict';

const _ = require('lodash');
const respond = require('../../components/respond-without-id-and-version');
const apiKey = require('../../components/api-key');
const commonRequestValidator = require('../../components/request-validator');
const requestValidator = require('./request-validator');

module.exports = createOrUpdate => {

  const rules =  _.merge({
    key: (createOrUpdate === 'update') 
      ? commonRequestValidator.schema.requiredString 
      : { optional: true, isApiKeyAvailable: { errorMessage: commonRequestValidator.errorMessages.unavailable }}
  }, requestValidator.commonRules);

  function save(req) {
    return new Promise((resolve, reject)=> {
      commonRequestValidator.validate(req, rules).then(() => {
        apiKey[createOrUpdate](req.body).then(resolve, reject);
      }, reject);
    });
  }

  return (req, res)=> {
    return respond(res, save(req));
  };
};