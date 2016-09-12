'use strict';

const respond = require('../respond-without-id-and-version');
const requestValidator = require('../request-validator');
const searchControls = require('../search-controls');

module.exports = {
  respond: respond,
  requestValidator: requestValidator,
  create: {
    rules: {}
  },
  update: {
    rules: {}
  },
  find: {
    rules: searchControls.validationRules,
    getControls: searchControls.get,
    getConditions: () => null
  }
};