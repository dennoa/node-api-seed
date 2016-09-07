'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const api = require('./index');

function request(method, path) {
  let app = express();
  app.use(bodyParser.json());
  api(app);
  return supertest(app)[method](path).set('Accept', 'application/json');
}

module.exports = {
  request: request
};