'use strict';

const expect = require('chai').expect;
const specHelper = require('../spec-helper');

describe('authentication support', ()=> {

  it('should not allow local login until the app implements support for this', (done) => {
    specHelper.request('post', '/auth/login').send({ username: 'me', password: 'secret' }).end((err, res) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

});