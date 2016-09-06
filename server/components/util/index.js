'use strict';

function isSpecified(obj) {
  return (typeof obj !== 'undefined') && (obj !== null);
}

function getOptionalValue(value, defaultValue) {
  return isSpecified(value) ? value : defaultValue;
}

function isPositiveInteger(num) {
  return isSpecified(num) && !!(''+ num).match(/^([0-9]*)$/);
}

module.exports = {
  isSpecified: isSpecified,
  isPositiveInteger: isPositiveInteger,
  getOptionalValue: getOptionalValue
};