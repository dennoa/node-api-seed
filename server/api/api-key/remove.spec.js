'use strict';

const remove = require('./remove');
const apiKey = require('../../components/api-key');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('api-key remove api', ()=> {

  let req, res, resStatus, resSend, resJson;
  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    req = { params: {} };
    resSend = sinon.stub();
    resJson = sinon.stub();
    resStatus = sinon.stub().returns({ send: resSend, json: resJson });
    res = { status: resStatus };
    sinon.stub(apiKey, 'remove');
  });

  afterEach(()=> {
    apiKey.remove.restore();
  });

  it('should remove an api key', (done)=> {
    req.params = { key: 'my key' };
    apiKey.remove.returns(new Promise((resolve)=> { resolve(); }));
    remove(req, res).then(()=> {
      expect(resStatus.calledWith(204)).to.be.true;
      done();
    });
  });

  it('should respond with any errors encountered when removing an api key', (done)=> {
    req.params = { key: 'my key' };
    apiKey.remove.returns(new Promise((resolve, reject)=> { reject(expectedError); }));
    remove(req, res).then(()=> {
      expect(resStatus.calledWith(500)).to.be.true;
      expect(resJson.firstCall.args[0].error).to.equal(expectedError);
      done();
    });
  });

});