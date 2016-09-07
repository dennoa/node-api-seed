'use strict';

const controls = require('./index');
const expect = require('chai').expect;

describe('search-controls', ()=> {

  it('should default the value for skip to 0', () => {
    expect(controls.get({}).skip).to.equal(0);
  });

  it('should use the provided value for skip', () => {
    expect(controls.get({ skip: 10 }).skip).to.equal(10);
  });

  it('should default the value for limit to 20', () => {
    expect(controls.get({}).limit).to.equal(20);
  });

  it('should use the provided value for limit', () => {
    expect(controls.get({ limit: 5 }).limit).to.equal(5);
  });

  it('should provide the swagger definitions for the skip and limit search controls', () => {
    expect(controls.swaggerProperties.skip.type).to.equal('number');
    expect(controls.swaggerProperties.skip.minimum).to.equal(0);
    expect(controls.swaggerProperties.skip.maximum).to.equal(500);
    expect(controls.swaggerProperties.limit.type).to.equal('number');
    expect(controls.swaggerProperties.limit.minimum).to.equal(1);
    expect(controls.swaggerProperties.limit.maximum).to.equal(200);
    expect(controls.swaggerProperties.limit.default).to.equal(20);
  });

  it('should provide validation rules for skip', () => {
    let rules = controls.validationRules.skip;
    expect(rules.optional).to.equal(true);
    expect(rules.isInt.errorMessage).to.equal('invalid');
    expect(rules.isInt.options[0].min).to.equal(0);
    expect(rules.isInt.options[0].max).to.equal(500);
  });

  it('should provide validation rules for limit', () => {
    let rules = controls.validationRules.limit;
    expect(rules.optional).to.equal(true);
    expect(rules.isInt.errorMessage).to.equal('invalid');
    expect(rules.isInt.options[0].min).to.equal(1);
    expect(rules.isInt.options[0].max).to.equal(200);
  });

});