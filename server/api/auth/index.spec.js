'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const specHelper = require('../spec-helper');
const user = require('../../components/user');
const auth = require('./index');

describe('authentication support', ()=> {

  beforeEach(() => {
    sinon.stub(user, 'get').returns(new Promise((resolve, reject) => reject()));
  });

  afterEach(() => {
    user.get.restore();
  });

  function verifyUserInfo(sanitized, raw) {
    expect(sanitized.ids.login).to.equal(raw.username);
    expect(sanitized.email).to.equal(raw.email);
  }

  it('should authenticate with the local login function', done => {
    let credentials = { username: 'barry', password: 'secret' };
    let userInfo = { username: credentials.username, passwordHash: auth.options.providers.login.hashPassword(credentials.password), email: 'barry@hoime.com' };
    user.get.returns(new Promise(resolve => resolve(userInfo)));
    specHelper.request('post', '/auth/login').send(credentials).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      verifyUserInfo(res.body.user_info, userInfo);
      verifyUserInfo(auth.jwt.decode(res.body.token), userInfo);
      done();
    });
  });

  it('should return unauthorized when the password does not match', done => {
    let credentials = { username: 'barry', password: 'secret' };
    let userInfo = { username: credentials.username, passwordHash: 'incorrect', email: 'barry@hoime.com' };
    user.get.returns(new Promise(resolve => resolve(userInfo)));
    specHelper.request('post', '/auth/login').send(credentials).end((err, res) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });
  

});