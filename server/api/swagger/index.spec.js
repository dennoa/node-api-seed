'use strict';

const expect = require('chai').expect;
const specHelper = require('../spec-helper');

describe('swagger docs', ()=> {

  it('should get the swagger docs', (done) => {
    specHelper.request('get', '/swagger').send().end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.swagger).to.equal('2.0');
      expect(res.body.basePath).to.equal('/');
      done();
    });
  });

});