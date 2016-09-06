'use strict';

const apiKey = require('./index');
const model = require('./api-key.model');
const logger = require('../logger');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('api-key', ()=> {

  let stubs = {};
  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    stubs.findExec = sinon.stub().returns(new Promise((resolve)=> { resolve(null); }));
    sinon.stub(model, 'create').returns(new Promise((resolve)=> { resolve(null); }));
    sinon.stub(model, 'findOne').returns({ exec: stubs.findExec });
    sinon.stub(logger, 'error');
  });

  afterEach(()=> {
    model.create.restore();
    model.findOne.restore();
    logger.error.restore();
  });

  it('should create a new ApiKey', (done)=> {
    let doc = { key: 'my api key' };
    apiKey.create(doc).then(()=> {
      expect(model.create.calledWith(doc)).to.be.true;
      done();
    });
  });

  it('should treat the non-existence of an api key on the request as invalid', (done)=> {
    var req = { get: sinon.stub() };
    apiKey.validate(req).catch(()=> {
      expect(req.get.calledWith('x-iag-api-key')).to.be.true;
      done();
    });
  });

  it('should treat an unknown api key as invalid', (done)=> {
    var myKey = 'my key';
    var req = { get: sinon.stub().returns(myKey) };
    apiKey.validate(req).catch(()=> {
      let args = model.findOne.firstCall.args[0];
      expect(args.key).to.equal(myKey);
      done();
    });
  });

  it('should treat a known api key as valid', (done)=> {
    var myKey = 'my key';
    var req = { get: sinon.stub().returns(myKey) };
    stubs.findExec.returns(new Promise((resolve, reject)=> {
      resolve({});
    }));
    apiKey.validate(req).then(()=> {
      done();
    });
  });

  it('should ensure an admin api key is available', (done)=> {
    apiKey.ensureAnAdminApiKeyIsAvailable().then(()=> {
      expect(model.findOne.firstCall.args[0].isAdmin).to.equal(true);
      expect(model.create).to.have.been.called;
      done();
    });
  });

  it('should not create an admin api key if one is already available', (done)=> {
    stubs.findExec.returns(new Promise((resolve)=> {
      resolve({});
    }));
    apiKey.ensureAnAdminApiKeyIsAvailable().then(()=> {
      expect(model.create.called).to.be.false;
      done();
    });
  });

});