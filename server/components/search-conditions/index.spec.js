'use strict';

const searchConditions = require('./index');
const expect = require('chai').expect;

describe('search-conditions', ()=> {

  let params = { field1: 'upper', field2: 'like', field3: 'range', field4: 'range', field5: 'exact', field6: 'lte', field7: 'gte' };
  let searchConditionsInstance = searchConditions(params);

  it('should omit from the search conditions any properties that are not part of the specified search parameters', ()=> {
    let conditions = searchConditionsInstance.get({ notSpecified: 'bob' });
    expect(typeof conditions.notSpecified === 'undefined').to.equal(true);
  });

  it('should create exact match search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field5: 'bob' });
    expect(conditions.field5).to.equal('bob');
  });

  it('should create uppercase search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field1: 'bob' });
    expect(conditions.field1).to.equal('BOB');
  });

  it('should create like search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field2: 'harry' });
    expect(conditions.field2).to.be.defined;
  });

  it('should create lte search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field6: 10 });
    expect(conditions.field6['$lte']).to.equal(10);
  });

  it('should create gte search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field7: 'something' });
    expect(conditions.field7['$gte']).to.equal('something');
  });

  it('should create range search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field3: {min: 1, max: 10} });
    let ranges = conditions['$and'];
    expect(ranges[0].field3['$lte']).to.equal(10);
    expect(ranges[1].field3['$gte']).to.equal(1);
  });

  it('should combine multiple range search conditions', ()=> {
    let conditions = searchConditionsInstance.get({ field3: {min: 1, max: 10}, field4: {min: 5, max: 6} });
    let ranges = conditions['$and'];
    expect(ranges[0].field3['$lte']).to.equal(10);
    expect(ranges[1].field3['$gte']).to.equal(1);
    expect(ranges[2].field4['$lte']).to.equal(6);
    expect(ranges[3].field4['$gte']).to.equal(5);
  });

  it('should combine all search conditions from the parameter definition and the incoming data', ()=> {
    let conditions = searchConditionsInstance.get({ field1: 'bob', field2: 'harry', field3: {min: 1, max: 10}, field4: {min: 5, max: 6} });
    expect(conditions.field1).to.equal('BOB');
    expect(conditions.field2).to.be.defined;
    let ranges = conditions['$and'];
    expect(ranges[0].field3['$lte']).to.equal(10);
    expect(ranges[1].field3['$gte']).to.equal(1);
    expect(ranges[2].field4['$lte']).to.equal(6);
    expect(ranges[3].field4['$gte']).to.equal(5);
  });

});