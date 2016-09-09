'use strict';

const _ = require('lodash');
const respond = require('../../components/respond');

function removeIdAndVersionFromObj(obj) {
  let o = obj.toObject ? obj.toObject(): obj;
  return _.omit(o, ['_id', '__v']);
}

function removeIdAndVersion(json) {
  if (json instanceof Array) {
    return _.map(json, removeIdAndVersionFromObj)
  }
  return removeIdAndVersionFromObj(json);
}

module.exports = respond({
  sanitizer: removeIdAndVersion
});