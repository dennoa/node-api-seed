'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const specHelper = require('../spec-helper');
const user = require('../../components/user');
const auth = require('./index');

describe('authentication support', ()=> {

  beforeEach(() => {
    sinon.stub(user, 'findByUsername');
  });

  afterEach(() => {
    user.findByUsername.restore();
  });

  it('should return unauthorized when the password does not match', done => {
    let credentials = { username: 'barry', password: 'secret' };
    let userInfo = { username: credentials.username, passwordHash: 'incorrect', email: 'barry@hoime.com' };
    user.findByUsername.yields(null, userInfo);
    specHelper.request('post', '/auth/login').send(credentials).end((err, res) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

});