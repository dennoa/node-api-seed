'use strict';

const apiKey = require('../components/api-key');

module.exports = require('../components/access-control')({
  getAccessInfo: req => apiKey.validate(req)
});