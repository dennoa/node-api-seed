'use strict'

const user = require('./index');
const model = require('./user.model');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('user', () => {

  let findExec;

  beforeEach(() => {
    findExec = sinon.stub().returns(new Promise((resolve, reject) => reject()));
    sinon.stub(model, 'findOne').returns({ exec: findExec });
  });

  afterEach(() => {
    model.findOne.restore();
  });

  it('should get a user by username', done => {
    let username = 'user1';
    let expected = { username: username, name: 'billy' };
    findExec.returns(new Promise(resolve => resolve(expected)));
    user.get(user.options.getKeyConditions({ username: username })).then(actual => {
      expect(model.findOne.calledWith({ username: username })).to.equal(true);
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  it('should get a user by other id', done => {
    let facebookId = 'user1';
    let expected = { ids: { facebook: facebookId }, name: 'billy' };
    findExec.returns(new Promise(resolve => resolve(expected)));
    user.get(user.options.getKeyConditions({ ids: { facebook: facebookId } })).then(actual => {
      expect(model.findOne.calledWith({ 'ids.facebook': facebookId })).to.equal(true);
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

});