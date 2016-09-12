'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const specHelper = require('./spec-helper');

xdescribe('api-key remove operation', ()=> {

  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    sinon.stub(apiKey, 'remove');
    sinon.stub(apiKey, 'validate').returns((req, res, next) => next());
  });

  afterEach(()=> {
    apiKey.remove.restore();
    apiKey.validate.restore();
  });

  it('should remove an api key', (done) => {
    apiKey.remove.returns(new Promise(resolve => resolve()));
    specHelper.request('delete', '/api-key/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(204);
      done();
    });
  });

  it('should respond with any errors encountered when removing an api key', (done)=> {
    apiKey.remove.returns(new Promise((resolve, reject)=> { reject(expectedError); }));
    specHelper.request('delete', '/api-key/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

});