'use strict';

const schema = require('../request-validator').schema;
const swaggerProperties = require('./swagger-properties');
const util = require('../util');

const validationRules = {
  limit: schema.optionalIntegerRange(1, 200),
  skip: schema.optionalIntegerRange(0, 500)
};


function get(options) {
  return {
    skip: parseInt(util.getOptionalValue(options.skip, 0)),
    limit: parseInt(util.getOptionalValue(options.limit, 20))
  };
}

module.exports = {
  validationRules: validationRules,
  get: get,
  swaggerProperties: swaggerProperties
};