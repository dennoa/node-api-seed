'use strict';

const validator = require('./index');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('request validator', ()=> {

  describe('middleware range validator', ()=> {

    let validRanges = [{min: 2000, max: 3000},{min: 0, max: 0},{min: '1', max: '1000'}];
    let invalidRanges = [null, {}, {min:0}, {min:0, max:-1},{min:'a', max: 'b'}];

    function rangeDesc(range) {
      return (range) ? range.min + ' - ' + range.max : null;
    }

    validRanges.forEach((range)=> {
      it('should allow a range of ' + rangeDesc(range), (done)=> {
        let req = { body: { rank_aad: range } };
        validator.prepare()(req, null, ()=> {
          req.checkBody('rank_aad', 'invalid').isValidPositiveIntegerRange();
          expect(req.validationErrors()).to.equal(false);
          done();
        });
      });
    });

    invalidRanges.forEach((range)=> {
      it('should disallow a range of ' + rangeDesc(range), (done)=> {
        let req = { body: { rank_aad: range } };
        validator.prepare()(req, null, ()=> {
          req.checkBody('rank_aad', 'invalid').isValidPositiveIntegerRange();
          let error = req.validationErrors()[0];
          expect(error.param).to.equal('rank_aad');
          expect(error.msg).to.equal('invalid');
          done();
        });
      });
    });

  });

  describe('validation', () => {

    let req;

    beforeEach(() => {
      req = { checkBody: sinon.stub(), asyncValidationErrors: sinon.stub().returns(new Promise(resolve => resolve())) };
    });

    it('should check the request body against the provided validation rules', (done) => {
      let validationRules = {
        key: validator.schema.requiredString,
        dateFrom: validator.schema.requiredDate,
        isAdmin: validator.schema.requiredBoolean,
        countRange: validator.schema.requiredIntegerRange(0, 10)
      };
      validator.validate(req, validationRules).then(() => {
        expect(req.checkBody.calledWith(validationRules)).to.equal(true);
        expect(req.asyncValidationErrors.calledOnce).to.equal(true);
        done();
      });
    });

    it('should fail validation according to the provided validation rules', (done) => {
      let errors = [{ param: 'key', msg: 'invalid' }];
      req.asyncValidationErrors.returns(new Promise((resolve, reject) => reject(errors)));
      let validationRules = {
        key: validator.schema.requiredString,
        dateFrom: validator.schema.optionalDate,
        isAdmin: validator.schema.optionalBoolean,
        countRange: validator.schema.optionalIntegerRange(5,15)
      };
      validator.validate(req, validationRules).catch(reason => {
        expect(reason).to.equal(errors);
        done();
      });
    });

  });

});