'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const crudMiddleware = require('./index');

module.exports = options => {

  function request(method, path) {
    let app = express();
    app.use(bodyParser.json());
    app.use('/crud-entity', crudMiddleware(options));
    return supertest(app)[method](path).set('Accept', 'application/json');
  }
  return {
    request: request
  }
};