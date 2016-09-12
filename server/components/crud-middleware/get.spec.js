'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const specHelper = require('./spec-helper');

xdescribe('crud-middleware get operation', ()=> {

  let expectedError = 'Expected for testing';
  let options, specHelperInstance;

  beforeEach(()=> {
    options = {
      crud: {
        get: sinon.stub().returns(new Promise((resolve, reject) => reject()))
      }
    };
    specHelperInstance = specHelper(options);
  });

  afterEach(()=> {
  });

  it('should get a model by key', (done) => {
    let doc = { key: '234', dateFrom: '2016-09-06T07:25:10.759Z' };
    options.crud.get.returns(new Promise(resolve => resolve(doc)));
    specHelperInstance.request('get', '/crud-entity/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal(doc);
      done();
    });
  });

  it('should respond with any errors encountered when getting an api key', (done)=> {
    options.crud.get.returns(new Promise((resolve, reject)=> { reject(expectedError); }));
    specHelperInstance.request('get', '/crud-entity/2348akkdf9').send().end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

});