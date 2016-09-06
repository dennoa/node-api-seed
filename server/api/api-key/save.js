'use strict';

const respond = require('../../components/respond');
const apiKey = require('../../components/api-key');
const requestValidator = require('../../components/request-validator');

module.exports = createOrUpdate => {

  const dateFromSchemaOptions = (createOrUpdate === 'create') ? { optional: false } : {}; 

  const validationRules = {
    key: requestValidator.schema.isLength({ optional: false, options: [{ min: 1 }] }),
    dateFrom: requestValidator.schema.isDate(dateFromSchemaOptions),
    dateTo: requestValidator.schema.isDate(),
    isAdmin: requestValidator.schema.isBoolean()
  };

  function save(req) {
    return new Promise((resolve, reject)=> {
      requestValidator.validate(req, validationRules).then(() => {
        apiKey[createOrUpdate](req.body).then(resolve, reject);
      }, reject);
    });
  }

  return (req, res)=> {
    return respond(res, save(req));
  };
};