'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const apiKey = require('../../components/api-key');
const specHelper = require('../spec-helper');

describe('api-key get operation', ()=> {

  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    sinon.stub(apiKey, 'get');
    sinon.stub(apiKey, 'validate').returns(new Promise(resolve => resolve({ isAdmin: true })));
  });

  afterEach(()=> {
    apiKey.get.restore();
    apiKey.validate.restore();
  });

  it('should get an api key', (done) => {
    let doc = { key: '234', dateFrom: '2016-09-06T07:25:10.759Z' };
    apiKey.get.returns(new Promise(resolve => resolve(doc)));
    specHelper.request('get', '/api-key/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(doc);
      done();
    });
  });

  it('should respond with any errors encountered when getting an api key', (done)=> {
    apiKey.get.returns(new Promise((resolve, reject)=> { reject(expectedError); }));
    specHelper.request('get', '/api-key/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

});