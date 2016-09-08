'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const swagger = require('./index');
const apiKey = require('../../../components/api-key');

describe('api-key swagger docs', () => {

  let req;

  beforeEach(() => {
    req = {};
    sinon.stub(apiKey, 'validate').returns(new Promise(resolve => resolve({ isAdmin: false })));
  });

  afterEach(() => {
    apiKey.validate.restore();
  });

  it('should not return any api docs when no valid api key has been provided', done => {
    apiKey.validate.returns(new Promise((resolve, reject) => reject()));
    swagger(req).then(docs => {
      expect(docs).to.equal(null);
      done();
    });
  });

  it('should not return any api docs when the provided api key is not for an administrator', done => {
    apiKey.validate.returns(new Promise(resolve => resolve({ isAdmin: false })));
    swagger(req).then(docs => {
      expect(docs).to.equal(null);
      done();
    });
  });

  it('should return the api docs when the provided api key is for an administrator', () => {
    apiKey.validate.returns(new Promise(resolve => resolve({ isAdmin: true })));
    swagger(req).then(docs => {
      expect(docs.tags[0].name).to.equal('api-key-admin');
      done();
    });
  });
  
});