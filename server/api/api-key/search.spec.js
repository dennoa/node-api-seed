'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const apiKey = require('../../components/api-key');
const specHelper = require('../spec-helper');

describe('api-key search operation', ()=> {

  let expectedError = 'Expected for testing';
  let skip, limit, exec;

  beforeEach(()=> {
    exec = sinon.stub().returns(new Promise(resolve => resolve([])));
    limit = sinon.stub().returns({ exec: exec });
    skip = sinon.stub().returns({ limit: limit });
    sinon.stub(apiKey, 'find').returns({ skip: skip });
    sinon.stub(apiKey, 'validate').returns(new Promise(resolve => resolve({ isAdmin: true })));
  });

  afterEach(()=> {
    apiKey.find.restore();
    apiKey.validate.restore();
  });

  let validSearchConditions = [
    { description: ' with no restriction', params: {} },
    { description: ' by key', params: { key: 'asd' } },
    { description: ' by dateFrom', params: { dateFrom: '2016-09-06T07:25:10.759Z' } },
    { description: ' by dateTo', params: { dateTo: '2016-09-06T07:25:10.759Z' } },
    { description: ' by isAdmin', params: { isAdmin: true } },
    { description: ' by dateFrom and dateTo', params: { dateFrom: '2016-09-06T07:25:10.759Z', dateTo: '2016-09-07T07:25:10.759Z' } },
    { description: ' by key, dateFrom, dateTo and isAdmin', params: { key: 'dsfds', dateFrom: '2016-09-06T07:25:10.759Z', dateTo: '2016-09-07T07:25:10.759Z', isAdmin: false } }
  ];

  let invalidSearchConditions = [
    { description: ' by invalid dateFrom', params: { dateFrom: '2016-xy-06T07:25:10.759Z' }, verifyError: (error => expect(error[0].param).to.equal('dateFrom')) },
    { description: ' by invalid dateTo', params: { dateTo: '2016-x09-06T07:25:10.759Z' }, verifyError: (error => expect(error[0].param).to.equal('dateTo')) },
    { description: ' by invalid isAdmin flag', params: { isAdmin: 'nope' }, verifyError: (error => expect(error[0].param).to.equal('isAdmin')) },
    { description: ' by invalid dateFrom, dateTo and isAdmin', params: { dateFrom: 'x2016-10-06T07:25:10.759Z', dateTo: 'bad date', isAdmin: 'yes' }, verifyError: (error => {
      expect(error[0].param).to.equal('dateFrom');
      expect(error[1].param).to.equal('dateTo');
      expect(error[2].param).to.equal('isAdmin');
    }) }
  ];

  validSearchConditions.forEach(condition => {
    it('should find api keys when searching ' + condition.description, (done) => {
      let docs = [{ key: '234', dateFrom: '2016-09-06T07:25:10.759Z' }, { key: 'abc', dateFrom: '2016-10-06T07:25:10.759Z' }];
      exec.returns(new Promise(resolve => resolve(docs)));
      specHelper.request('post', '/api-key/search').send(condition.params).end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.deep.equal(docs);
        done();
      });
    });
  });

  invalidSearchConditions.forEach(condition => {
    it('should respond with validation errors when searching ' + condition.description, (done) => {
      specHelper.request('post', '/api-key/search').send(condition.params).end((err, res) => {
        expect(res.statusCode).to.equal(400);
        condition.verifyError(res.body);
        done();
      });
    });
  });

  it('should respond with any unexpected error encountered when searching', (done) => {
    exec.returns(new Promise((resolve, reject) => reject(expectedError)));
    specHelper.request('post', '/api-key/search').send().end((err, res) => {
      expect(res.statusCode).to.equal(500);
      expect(res.body.error).to.equal(expectedError);
      done();
    });
  });

});