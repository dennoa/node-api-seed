'use strict';

const util = require('./index');
const expect = require('chai').expect;

describe('util', ()=> {

  it('should indicate that undefined values are not specified', ()=> {
    expect(util.isSpecified()).to.equal(false);
  });

  it('should indicate that null values are not specified', ()=> {
    expect(util.isSpecified(null)).to.equal(false);
  });

  ['', { some: 'obj' }, new Date(), 0, 1].forEach(value => {
    it('should indicate that ' + JSON.stringify(value) + ' is specified', ()=> {
      expect(util.isSpecified(value)).to.equal(true);
    });
  });

  it('should get the default value when no value has been specified', () => {
    let value, defaultValue = 'default';
    expect(util.getOptionalValue(value, defaultValue)).to.equal(defaultValue);
  });

  it('should get the value when it has been specified', () => {
    let value = 'value', defaultValue = 'default';
    expect(util.getOptionalValue(value, defaultValue)).to.equal(value);
  });

  [0, 1, '0', '5'].forEach(value => {
    it('should indicate that "' + value + '" is a positive integer', () => {
      expect(util.isPositiveInteger(value)).to.equal(true);
    });
  });

  [-1, '', 'ab', '-5'].forEach(value => {
    it('should indicate that "' + value + '" is not a positive integer', () => {
      expect(util.isPositiveInteger(value)).to.equal(false);
    });
  });

});