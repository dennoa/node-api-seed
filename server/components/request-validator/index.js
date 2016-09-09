'use strict';

const _ = require('lodash');
const expressValidator = require('express-validator');
const util = require('../util');

const errorMessages = {
  invalid: 'invalid',
  required: 'required',
  unavailable: 'unavailable'
};

const schema = {
  optionalDate: { optional: true, isDate: { errorMessage: errorMessages.invalid }},
  requiredDate: { isDate: { errorMessage: errorMessages.invalid }},
  requiredString: { isLength: { options: [{ min: 1 }], errorMessage: errorMessages.required }},
  optionalBoolean: { optional: true, isBoolean: { errorMessage: errorMessages.invalid }},
  requiredBoolean: { isBoolean: { errorMessage: errorMessages.invalid }},
  optionalIntegerRange: (min, max) => { return { optional: true, isInt: { options: [{ min: min, max: max }], errorMessage: errorMessages.invalid }}; },
  requiredIntegerRange: (min, max) => { return { isInt: { options: [{ min: min, max: max }], errorMessage: errorMessages.invalid }}; }
};

function isValidPositiveIntegerRange(range) {
  return !!range && util.isPositiveInteger(range.min) && util.isPositiveInteger(range.max) && parseInt(range.min) <= parseInt(range.max);
}

function prepare(options) {
  return expressValidator(_.merge({
    customValidators: {
      isValidPositiveIntegerRange: isValidPositiveIntegerRange
    }
  }, options));
}

function validate(req, validationRules) {
  return new Promise((resolve, reject)=> {
    req.checkBody(validationRules); //Only supports checkBody as check does not seem to function as expected
    req.asyncValidationErrors().then(resolve, reject);
  });
}

module.exports = {
  errorMessages: errorMessages,
  prepare: prepare,
  schema: schema,
  validate: validate
};
