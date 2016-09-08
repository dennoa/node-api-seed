'use strict';

const _ = require('lodash');
const respond = require('../../components/respond');
const util = require('../../components/util');

const apiDocs = [
  require('../api-key/swagger')
];

//See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
const swagger = _.mergeWith({
  "swagger": "2.0",
  "info": {
    "title": "Node API Seed",
    "description": "Template for Node API projects.\n\nSwagger docs for the authentication operations are available under /auth/swagger.",
    "version": "1.0"
  },
  "basePath": "/",
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "tags": [
  ]
}, require('./security'), require('./error-definitions'), require('./integer-range'), util.concatArrays);

function merge(req) {
  return new Promise((resolve, reject) => {
    let merged = Object.assign({}, swagger);
    let other = apiDocs.map(doc => ((typeof doc === 'function') ? doc(req) : doc));
    let promises = [];
    other.forEach(doc => (doc instanceof Promise) ? promises.push(doc) : _.mergeWith(merged, doc, util.concatArrays));
    Promise.all(promises)
      .then(docs => resolve(docs.reduce((all, doc) => _.mergeWith(all, doc, util.concatArrays), merged)))
      .catch(reject);
  });
}

function routes(req, res) {
  respond(res, merge(req));
}

module.exports = {
  routes: routes,
  apiDocs: apiDocs
};