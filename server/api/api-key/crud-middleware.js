'use strict';

const _ = require('lodash');
const apiKey = require('../../components/api-key');
const searchConditions = require('../../components/search-conditions');
const commonRequestValidator = require('../../components/request-validator');
const requestValidator = require('./request-validator');

module.exports = require('../../components/crud-middleware')({
  crud: apiKey,
  create: {
    rules: _.merge({ key: { optional: true, isApiKeyAvailable: { errorMessage: commonRequestValidator.errorMessages.unavailable }} }, requestValidator.commonRules)
  },
  update: {
    rules: _.merge({ key: commonRequestValidator.schema.requiredString }, requestValidator.commonRules)
  },
  find: {
    rules: requestValidator.commonRules,
    getConditions: searchConditions({ key: 'like', dateFrom: 'gte', dateTo: 'lte', isAdmin: 'exact' }).get
  }
});