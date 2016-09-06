'use strict';

const validate = require('./validate');
const apiKey = require('../../components/api-key');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('api-key validation middleware', ()=> {

  var req, res, next, resStatus, resSend;

  beforeEach(()=> {
    req = {};
    resSend = sinon.stub();
    resStatus = sinon.stub().returns({ send: resSend });
    res = { status: resStatus };
    next = sinon.stub();
    sinon.stub(apiKey, 'validate');
  });

  afterEach(()=> {
    apiKey.validate.restore();
  });

  it('should allow access for valid api keys', (done)=> {
    apiKey.validate.returns(new Promise((resolve)=> { resolve({}); }));
    validate.forReadOnly(req, res, next).then(()=> {
      expect(next).to.have.been.called;
      done();
    });
  });

  it('should deny access for invalid api keys', (done)=> {
    apiKey.validate.returns(new Promise((resolve, reject)=> { reject(); }));
    validate.forReadOnly(req, res, next).then(()=> {
      expect(resStatus.calledWith(401)).to.be.true;
      expect(resSend).to.have.been.called;
      expect(next).not.to.have.been.called;
      done();
    });
  });

  it('should allow access for valid admin api keys', (done)=> {
    apiKey.validate.returns(new Promise((resolve)=> { resolve({isAdmin: true }); }));
    validate.forAdmin(req, res, next).then(()=> {
      expect(next).to.have.been.called;
      done();
    });
  });

  it('should deny admin access for valid api keys that are not admin keys', (done)=> {
    apiKey.validate.returns(new Promise((resolve)=> { resolve({}); }));
    validate.forAdmin(req, res, next).then(()=> {
      expect(resStatus.calledWith(401)).to.be.true;
      expect(resSend).to.have.been.called;
      expect(next).not.to.have.been.called;
      done();
    });
  });

});