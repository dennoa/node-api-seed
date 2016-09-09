'use strict';

const _ = require('lodash');
const respond = require('../../components/respond-without-id-and-version');
const apiKey = require('../../components/api-key');
const searchControls = require('../../components/search-controls');
const commonRequestValidator = require('../../components/request-validator');
const searchConditions = require('../../components/search-conditions');
const requestValidator = require('./request-validator');

const rules = _.merge({}, requestValidator.commonRules, searchControls.validationRules);
const conditions = searchConditions({ key: 'like', dateFrom: 'gte', dateTo: 'lte', isAdmin: 'exact' });

function search(req) {
  return new Promise((resolve, reject)=> {
    commonRequestValidator.validate(req, rules).then(() => {
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