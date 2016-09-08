'use strict';

const apiKey = require('../../components/api-key');

function notAuthorized(res) {
  res.status(401).send();
}

function validate(req, res, next, requiresAdmin) {
  return apiKey.validate(req).then(apiDoc => {
    return (requiresAdmin && !apiDoc.isAdmin) ? notAuthorized(res) : next();
  }).catch(()=> {
    notAuthorized(res);
  });
}

function validateReadOnly(req, res, next) {
  return validate(req, res, next, false);
}

function validateAdmin(req, res, next) {
  return validate(req, res, next, true);
}

module.exports = {
  forReadOnly: validateReadOnly,
  forAdmin: validateAdmin
};
