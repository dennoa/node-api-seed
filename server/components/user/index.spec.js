'use strict'

const user = require('./index');
const model = require('./user.model');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('user', () => {

  beforeEach(() => {
    sinon.stub(model, 'findOne');
  });

  afterEach(() => {
    model.findOne.restore();
  });

  it('should find a user by username', done => {
    let username = 'user1';
    let expected = { username: username, name: 'billy' };
    model.findOne.yields(null, expected);
    user.findByUsername(username, (err, actual) => {
      expect(model.findOne.calledWith({ username: username })).to.equal(true);
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  it('should find a user by other id', done => {
    let facebookId = 'user1';
    let expected = { ids: { facebook: facebookId }, name: 'billy' };
    model.findOne.yields(null, expected);
    user.findByUserId('facebook', facebookId, (err, actual) => {
      expect(model.findOne.calledWith({ 'ids.facebook': facebookId })).to.equal(true);
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

});