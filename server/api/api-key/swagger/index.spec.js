'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const swagger = require('./index');
const accessControl = require('../../access-control');

describe('api-key swagger docs', () => {

  let req;

  beforeEach(() => {
    req = {};
    sinon.stub(accessControl, 'validate').returns(new Promise(resolve => resolve()));
  });

  afterEach(() => {
    accessControl.validate.restore();
  });

  it('should not return any api docs when no valid api key has been provided', done => {
    accessControl.validate.returns(new Promise((resolve, reject) => reject()));
    swagger(req).then(docs => {
      expect(docs).to.equal(null);
      done();
    });
  });

  it('should return the api docs when the provided api key has access', () => {
    swagger(req).then(docs => {
      expect(docs.tags[0].name).to.equal('api-key-admin');
      done();
    });
  });
  
});