'use strict';

const _ = require('lodash');
const expressValidator = require('express-validator');
const util = require('../util');

function errorInvalid(key) {
  return options => {
    let result = (options && (options.optional === false)) ? {} : { optional: true };
    result[key] = _.merge({ errorMessage: 'invalid' }, _.omit(options, 'optional'));
    return result;
  };
}

const schema = {
  isDate: errorInvalid('isDate'),
  isBoolean: errorInvalid('isBoolean'),
  isInt: errorInvalid('isInt'),
  isLength: errorInvalid('isLength')
};

function isValidRange(range) {
  return !!range && util.isPositiveInteger(range.min) && util.isPositiveInteger(range.max) && parseInt(range.min) <= parseInt(range.max);
}

function middleware() {
  return expressValidator({
    customValidators: {
      isValidRange: isValidRange
    }
  });
}

function validate(req, validationRules) {
  return new Promise((resolve, reject)=> {
    req.check(validationRules);
    let errors = req.validationErrors();
    if (errors) { return reject(errors); }
    resolve();
  });
}

module.exports = {
  middleware: middleware,
  schema: schema,
  validate: validate
};