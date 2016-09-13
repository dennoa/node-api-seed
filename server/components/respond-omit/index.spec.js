'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const respond = require('./index');

describe('respond-omit', () => {

  let res, resStatus, resJson, instance;

  beforeEach(()=> {
    resJson = sinon.stub();
    resStatus = sinon.stub().returns({ json: resJson });
    res = { status: resStatus };
    instance = respond();
  });

  it('should remove _id and __v from objects', done => {
    instance(res, new Promise(resolve => resolve({ _id: '324', __v: 0, ok: 'ok' }))).then(()=> {
      let json = resJson.firstCall.args[0];
      expect(typeof json._id).to.equal('undefined');
      expect(typeof json.__v).to.equal('undefined');
      expect(json.ok).to.equal('ok');
      done();
    });
  });

  it('should convert mongoose objects to plain objects in order to remove the _id and __v fields', done => {
    let obj = { _id: '324', __v: 0, ok: 'ok' };
    obj.toObject = sinon.stub().returns(obj);
    instance(res, new Promise(resolve => resolve(obj))).then(()=> {
      let json = resJson.firstCall.args[0];
      expect(typeof json._id).to.equal('undefined');
      expect(typeof json.__v).to.equal('undefined');
      expect(obj.toObject.calledOnce).to.equal(true);
      done();
    });
  });

  it('should remove _id and __v from arrays of objects', done => {
    instance(res, new Promise(resolve => resolve([{ _id: '324', __v: 5, ok: 'ok' },{ _id: '324' },{ __v: 2 }]))).then(()=> {
      let json = resJson.firstCall.args[0];
      expect(json.filter(obj => (obj._id || obj.__v)).length).to.equal(0);
      done();
    });
  });

});