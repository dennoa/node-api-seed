'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const apiKey = require('../../components/api-key');
const specHelper = require('../spec-helper');

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

  it('should create an api key', (done) => {
    let doc = { key: '234', dateFrom: '2016-09-06T07:25:10.759Z' };
    apiKey.create.returns(new Promise(resolve => resolve(doc)));
    specHelper.request('post', '/api-key').send(doc).end((err, res) => {
      expect(apiKey.create.calledWith(doc)).to.equal(true);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(doc);
      done();
    });
  });

  it('should return any unexpected error encountered when creating an api key', (done) => {
    let doc = { key: '234', dateFrom: '2016-09-06T07:25:10.759Z' };
    apiKey.create.returns(new Promise((resolve, reject) => reject(expectedError)));
    specHelper.request('post', '/api-key').send(doc).end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

  it('should update an api key', (done) => {
    let doc = { key: '234', dateTo: '2016-10-06T07:25:10.759Z' };
    apiKey.update.returns(new Promise(resolve => resolve(doc)));
    specHelper.request('put', '/api-key').send(doc).end((err, res) => {
      expect(apiKey.update.calledWith(doc)).to.equal(true);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(doc);
      done();
    });
  });

  it('should not update an api key when no key has been provided', (done) => {
    let doc = { dateTo: '2016-10-06T07:25:10.759Z' };
    specHelper.request('put', '/api-key').send(doc).end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body[0].param).to.equal('key');
      done();
    });
  });

  it('should return any unexpected error encountered when updating an api key', (done) => {
    let doc = { key: '234', dateTo: '2016-10-06T07:25:10.759Z' };
    apiKey.update.returns(new Promise((resolve, reject) => reject(expectedError)));
    specHelper.request('put', '/api-key').send(doc).end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

});