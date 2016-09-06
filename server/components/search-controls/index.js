'use strict';

const schema = require('../request-validator').schema;
const swaggerProperties = require('./swagger-properties');
const util = require('../util');

const validationRules = {
  limit: schema.isInt({ options: [{ min: 1, max: 200 }] }),
  skip: schema.isInt({ options: [{ min: 0, max: 500 }] })
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