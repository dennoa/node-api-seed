'use strict';

const respond = require('promise-to-respond');
const apiKey = require('../../components/api-key');
const searchConditions = require('../../components/search-conditions');
const searchControls = require('../../components/search-controls');
const requestValidator = require('./request-validator');

const conditions = searchConditions({ key: 'like', dateFrom: 'gte', dateTo: 'lte', isAdmin: 'exact' });

module.exports = require('cruddy-express-api').middleware({
  getCrudModel: () => apiKey,
  create: {
    rules: requestValidator.createRules
  },
  update: {
    rules: requestValidator.updateRules
  },
  find: {
    rules: requestValidator.findRules,
    getControls: searchControls.get,
    getConditions: conditions.get
  },
  validateRequest: requestValidator.validate,
  respond: respond({ fieldsToOmit: ['_id', '__v'] })
});