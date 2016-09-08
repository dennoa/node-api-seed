'use strict';

function isSpecified(obj) {
  return (typeof obj !== 'undefined') && (obj !== null);
}

function getOptionalValue(value, defaultValue) {
  return isSpecified(value) ? value : defaultValue;
}

function isPositiveInteger(num) {
  return isSpecified(num) && !!(''+ num).match(/^([0-9]+)$/);
}

function concatArrays(target, source) {
  if (target instanceof Array && source instanceof Array) {
    return target.concat(source);
  } 
}

module.exports = {
  isSpecified: isSpecified,
  isPositiveInteger: isPositiveInteger,
  getOptionalValue: getOptionalValue,
  concatArrays: concatArrays
};