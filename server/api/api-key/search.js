'use strict';

const _ = require('lodash');
const respond = require('../../components/respond');
const apiKey = require('../../components/api-key');
const searchControls = require('../../components/search-controls');
const requestValidator = require('../../components/request-validator');
const util = require('../../components/util');
const searchConditions = require('../../components/search-conditions');

const validationRules = _.merge({
  dateFrom: requestValidator.schema.isDate(),
  dateTo: requestValidator.schema.isDate(),
  isAdmin: requestValidator.schema.isBoolean()
}, searchControls.validationRules);

const conditions = searchConditions({ key: 'like', dateFrom: 'gte', dateTo: 'lte', isAdmin: 'exact' });

function search(req) {
  return new Promise((resolve, reject)=> {
    requestValidator.validate(req, validationRules).then(() => {
      let controls = searchControls.get(req.body);
      apiKey.find(conditions.get(req.body))
        .skip(controls.skip)
        .limit(controls.limit)
        .exec()
        .then(resolve, reject);
    }, reject);
  });
}

module.exports = (req, res)=> {
  return respond(res, search(req));
};