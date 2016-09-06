'use strict';

const validator = require('./index');
const expect = require('chai').expect;

describe('request validator', ()=> {

  describe('range validator', ()=> {

    let validRanges = [{min: 2000, max: 3000},{min: 0, max: 0},{min: '1', max: '1000'}];
    let invalidRanges = [null, {}, {min:0}, {min:0, max:-1},{min:'a', max: 'b'}];

    function rangeDesc(range) {
      return (range) ? range.min + ' - ' + range.max : null;
    }

    validRanges.forEach((range)=> {
      it('should allow a range of ' + rangeDesc(range), (done)=> {
        let req = { body: { rank_aad: range } };
        validator.middleware()(req, null, ()=> {
          req.checkBody('rank_aad', 'invalid').isValidRange();
          expect(req.validationErrors()).to.equal(false);
          done();
        });
      });
    });

    invalidRanges.forEach((range)=> {
      it('should disallow a range of ' + rangeDesc(range), (done)=> {
        let req = { body: { rank_aad: range } };
        validator.middleware()(req, null, ()=> {
          req.checkBody('rank_aad', 'invalid').isValidRange();
          let error = req.validationErrors()[0];
          expect(error.param).to.equal('rank_aad');
          expect(error.msg).to.equal('invalid');
          done();
        });
      });
    });

  });

});