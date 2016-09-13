'use strict';

const _ = require('lodash');
const user = require('../../components/user');
const respondOmit = require('../../components/respond-omit');
const searchConditions = require('../../components/search-conditions');
const searchControls = require('../../components/search-controls');
const requestValidator = require('./request-validator');

const conditions = searchConditions({ username: 'like', email: 'like', name: 'like', isAdmin: 'exact' });

const respond = respondOmit(['_id', '__v', 'passwordHash']);

module.exports = require('cruddy-express-api').middleware({
  getCrudModel: () => user,
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
  respond: respond
});