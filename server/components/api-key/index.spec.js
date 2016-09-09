'use strict';

const apiKey = require('./index');
const model = require('./api-key.model');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('api-key', ()=> {

  let stubs = {};
  let expectedError = 'Expected for testing';

  beforeEach(()=> {
    stubs.findResponse = { exec: sinon.stub().returns(new Promise(resolve => resolve([]))) };
    stubs.findResponse.skip = sinon.stub().returns(stubs.findResponse);
    stubs.findResponse.limit = sinon.stub().returns(stubs.findResponse);
    stubs.findExec = sinon.stub().returns(new Promise(resolve => resolve(null)));
    sinon.stub(model, 'create').returns(new Promise(resolve => resolve(null)));
    sinon.stub(model, 'findOne').returns({ exec: stubs.findExec });
    sinon.stub(model, 'find').returns(stubs.findResponse);
  });

  afterEach(()=> {
    model.create.restore();
    model.findOne.restore();
    model.find.restore();
  });

  it('should create a new ApiKey', (done)=> {
    let doc = { key: 'my api key', dateFrom: new Date() };
    apiKey.create(doc).then(()=> {
      expect(model.create.calledWith(doc)).to.be.true;
      done();
    });
  });

  it('should create a new ApiKey relying on default values for everything', (done)=> {
    apiKey.create().then(()=> {
      expect(model.create.firstCall.args[0].key.length).to.be.greaterThan(0);
      done();
    });
  });

  it('should generate a key value if none is provided when creating new ApiKey', (done)=> {
    let doc = { dateFrom: new Date() };
    apiKey.create(doc).then(() => {
      let created = model.create.firstCall.args[0];
      expect(created.key.length).to.be.greaterThan(0);
      done();
    });
  });

  it('should get an existing ApiKey', (done) => {
    let existing = { key: 'some key', dateFrom: new Date() };
    stubs.findExec.returns(new Promise(resolve => resolve(existing)));
    apiKey.get(existing.key).then(found => {
      expect(found).to.deep.equal(existing);
      done();
    });
  });

  it('should reject with an empty reason when trying to get an ApiKey that does not exist', (done) => {
    apiKey.get('not found').catch(reason => {
      expect(typeof reason === 'undefined').to.equal(true);
      done();
    });
  });

  it('should reject with an error when it fails to get an ApiKey because of something unexpected', (done) => {
    stubs.findExec.returns(new Promise((resolve, reject) => reject(expectedError)));
    apiKey.get('some-key').catch(reason => {
      expect(reason).to.equal(expectedError);
      done();
    });
  });

  it('should update an existing ApiKey', (done) => {
    let existing = { key: 'some key', dateFrom: new Date(), save: sinon.stub().yields() };
    stubs.findExec.returns(new Promise(resolve => resolve(existing)));
    let doc = { key: existing.key, dateTo: new Date(), isAdmin: true };
    apiKey.update(doc).then(updated => {
      expect(updated.key).to.equal(existing.key);
      expect(updated.dateFrom).to.equal(existing.dateFrom);
      expect(updated.dateTo).to.equal(doc.dateTo);
      expect(updated.isAdmin).to.equal(doc.isAdmin);
      done();
    });
  });

  it('should reject with an error when it fails to update an ApiKey because of something unexpected when retrieving', (done) => {
    stubs.findExec.returns(new Promise((resolve, reject) => reject(expectedError)));
    let doc = { key: 'my-key', dateTo: new Date(), isAdmin: true };
    apiKey.update(doc).catch(reason => {
      expect(reason).to.equal(expectedError);
      done();
    });
  });

  it('should reject with an error when it fails to update an ApiKey because of something unexpected when saving', (done) => {
    let existing = { key: 'some key', dateFrom: new Date(), save: sinon.stub().yields(expectedError) };
    stubs.findExec.returns(new Promise(resolve => resolve(existing)));
    let doc = { key: existing.key, dateTo: new Date(), isAdmin: true };
    apiKey.update(doc).catch(reason => {
      expect(reason).to.equal(expectedError);
      done();
    });
  });

  it('should remove an existing ApiKey', (done) => {
    let existing = { key: 'some key', dateFrom: new Date(), remove: sinon.stub().yields() };
    stubs.findExec.returns(new Promise(resolve => resolve(existing)));
    apiKey.remove(existing.key).then(done);
  });

  it('should reject with an error when it fails to remove an ApiKey because of something unexpected when retrieving', (done) => {
    stubs.findExec.returns(new Promise((resolve, reject) => reject(expectedError)));
    apiKey.remove('some-key').catch(reason => {
      expect(reason).to.equal(expectedError);
      done();
    });
  });

  it('should reject with an error when it fails to remove an ApiKey because of something unexpected when deleting', (done) => {
    let existing = { key: 'some key', dateFrom: new Date(), remove: sinon.stub().yields(expectedError) };
    stubs.findExec.returns(new Promise(resolve => resolve(existing)));
    apiKey.remove('key').catch(reason => {
      expect(reason).to.equal(expectedError);
      done();
    });
  });

  it('should find an ApiKey using the provided conditions', (done) => {
    let conditions = { dateFrom: { $gte: new Date() }};
    apiKey.find(conditions).skip(0).limit(20).exec().then(results => {
      expect(model.find.calledWith(conditions)).to.equal(true);
      done();
    });
  });

  it('should expose the request header used for the api key', () => {
    expect(apiKey.requestHeaderKey).to.equal('x-iag-api-key');
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

  it('should respond with any error encountered when creating a default admin api key', (done)=> {
    model.create.returns(new Promise((resolve, reject) => reject(expectedError)));
    apiKey.ensureAnAdminApiKeyIsAvailable().catch(err => {
      expect(err).to.equal(expectedError);
      done();
    });
  });

  describe('validatation middleware', () => {
    let req, statusReturn, status, res;

    beforeEach(() => {
      req = { get: sinon.stub().returns(null) };
      statusReturn = { send: sinon.stub() };
      status = sinon.stub().returns(statusReturn);
      res = { status: status, locals: {} };
    });

    it('should treat the non-existence of an api key on the request as invalid', (done)=> {
      statusReturn.send = ()=> {
        expect(req.get.calledWith(apiKey.requestHeaderKey)).to.be.true;
        expect(status.calledWith(401)).to.equal(true);
        done();
      };
      apiKey.validate()(req, res);
    });

    it('should treat an unknown api key as invalid', (done)=> {
      let myKey = 'my key';
      req.get.returns(myKey);
      statusReturn.send = ()=> {
        let args = model.findOne.firstCall.args[0];
        expect(args.key).to.equal(myKey);
        expect(status.calledWith(401)).to.equal(true);
        done();
      };
      apiKey.validate()(req, res);
    });

    it('should treat a non-admin api key as invalid when an admin key is required', (done)=> {
      let myKey = 'my key';
      req.get.returns(myKey);
      stubs.findExec.returns(new Promise((resolve, reject)=> { resolve({}); }));
      statusReturn.send = ()=> {
        expect(status.calledWith(401)).to.equal(true);
        done();
      };
      apiKey.validate({ isAdmin: true })(req, res);
    });

    it('should treat a known api key as valid', (done)=> {
      let myKey = 'my key';
      req.get.returns(myKey);
      stubs.findExec.returns(new Promise((resolve, reject)=> { resolve({}); }));
      apiKey.validate()(req, res, () => {
        done();
      });
    });

    it('should treat a known admin api key as valid when an admin key is required', (done)=> {
      let myKey = 'my key';
      req.get.returns(myKey);
      stubs.findExec.returns(new Promise((resolve, reject)=> { resolve({ isAdmin: true }); }));
      apiKey.validate({ isAdmin: true })(req, res, () => {
        done();
      });
    });

  });

});