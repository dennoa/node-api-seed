'use strict'

const _ = require('lodash');
const defaultOptions = require('./options');

function notAuthorized(res) {
  res.status(401).send();
}

module.exports = options => {

  let opts = _.merge({}, defaultOptions, options);

  function init() {
    return (req, res, next) => {
      return opts.getAccessInfo(req).then(doc => {
        res.locals[opts.reslocal] = doc;
        next();
      }).catch(() => {
        res.locals[opts.reslocal] = null;
        next();
      });
    };
  }

  function validate(res, pathOptions) {
    return opts.validate(res.locals[opts.reslocal], pathOptions);
  }

  function middleware(pathOptions) {
    return (req, res, next) => {
      validate(res, pathOptions).then(next).catch(() => notAuthorized(res));
    };
  }

  return {
    init: init,
    validate: validate,
    middleware: middleware
  };
};