'use strict';

const _ = require('lodash');
const respond = require('../../components/respond');

module.exports = omit => {

  let fieldsToOmit = omit || ['_id', '__v'];

  function removeFieldsFromObj(obj) {
    let o = (obj && obj.toObject) ? obj.toObject(): obj;
    return _.omit(o, fieldsToOmit);
  }

  function removeFields(json) {
    if (json instanceof Array) {
      return _.map(json, removeFieldsFromObj)
    }
    return removeFieldsFromObj(json);
  }

  return respond({
    sanitizer: removeFields
  });
};