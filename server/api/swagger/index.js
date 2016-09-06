'use strict';

const _ = require('lodash');

//See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
const swagger = _.merge({
  "swagger": "2.0",
  "info": {
    "title": "Node API Seed",
    "description": "Template for Node API projects.",
    "version": "1.0"
  },
  "basePath": "/",
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "tags": [
  ],
},
  require('./security'),
  require('./error-definitions'),
  require('./number-range'),
  require('../api-key/swagger')
);

function routes(req, res) {
  res.status(200).send(swagger);
}

module.exports = {
  routes: routes
};