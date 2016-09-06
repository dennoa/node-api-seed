'use strict';

const routes = require('./index').routes;
const apiKey = require('../../components/api-key');
const expect = require('chai').expect;
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const requestValidator = require('../../components/request-validator');

describe('api-key save operations', ()=> {

  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    sinon.stub(apiKey, 'create');
    sinon.stub(apiKey, 'update');
    sinon.stub(apiKey, 'validate').returns(new Promise(resolve => resolve({ isAdmin: true })));
  });

  afterEach(()=> {
    apiKey.create.restore();
    apiKey.update.restore();
    apiKey.validate.restore();
  });

  function request(getOrPost) {
    let app = express();
    app.use(bodyParser.json());
    app.use(requestValidator.middleware());
    app.use('/api-key', routes);
    return supertest(app)[getOrPost]('/api-key')
      .set('Accept', 'application/json');
  }

  it('should create an api key', (done) => {
    let doc = { key: '234', dateFrom: '2016-09-06T07:25:10.759Z' };
    apiKey.create.returns(new Promise(resolve => resolve(doc)));
    request('post').send(doc).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(doc);
      done();
    });
  });

});