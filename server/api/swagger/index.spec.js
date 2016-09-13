'use strict';

const expect = require('chai').expect;
const specHelper = require('../supertest-spec-helper');
const apiKey = require('../../components/api-key');
const swagger = require('./index');

describe('swagger docs', ()=> {

  beforeEach(() => {
    while (swagger.apiDocs.length > 0) {
      swagger.apiDocs.pop();
    }
  });

  function verifyCore(res) {
    expect(res.statusCode).to.equal(200);
    expect(res.body.swagger).to.equal('2.0');
    expect(res.body.basePath).to.equal('/');
  }

  it('should get the swagger docs', done => {
    specHelper.request('get', '/swagger').send().end((err, res) => {
      verifyCore(res);
      done();
    });
  });

  it('should merge other simple api docs with the core swagger docs', done => {
    let doc = {
      tags: [{ name: 'my-awesome-api-operations', description: 'My awesome stuff' }]
    };
    swagger.apiDocs.push(doc);
    specHelper.request('get', '/swagger').send().end((err, res) => {
      verifyCore(res);
      expect(res.body.tags).to.deep.equal(doc.tags);
      done();
    });
  });

  it('should merge other generated api docs with the core swagger docs', done => {
    let tags = [{ name: 'my-awesome-api-operations', description: 'My awesome stuff' }, { name: 'my-average-bits', description: 'Ok I guess' }];
    let docFn = res => {
      return { tags: tags };
    };
    swagger.apiDocs.push(docFn);
    specHelper.request('get', '/swagger').send().end((err, res) => {
      verifyCore(res);
      expect(res.body.tags).to.deep.equal(tags);
      done();
    });
  });

  it('should merge other promised api docs with the core swagger docs', done => {
    let tags = [{ name: 'my-average-bits', description: 'Ok I guess' }];
    let docFn = req => {
      return new Promise(resolve => resolve({ tags: tags }));
    };
    swagger.apiDocs.push(docFn);
    specHelper.request('get', '/swagger').send().end((err, res) => {
      verifyCore(res);
      expect(res.body.tags).to.deep.equal(tags);
      done();
    });
  });

  it('should merge all other api docs with the core swagger docs', done => {
    swagger.apiDocs.push({ tags: [{ name: 'doc-tag' }] });
    swagger.apiDocs.push(req => { return { tags: [{ name: 'doc-fn-tag' }] }; });
    swagger.apiDocs.push(req => new Promise(resolve => resolve({ tags: [{ name: 'doc-promise-tag' }] })));
    specHelper.request('get', '/swagger').send().end((err, res) => {
      verifyCore(res);
      expect(res.body.tags.length).to.equal(3);
      ['doc-tag', 'doc-fn-tag', 'doc-promise-tag'].forEach(name => {
        expect(res.body.tags.filter(tag => (tag.name === name)).length).to.equal(1);
      });
      done();
    });
  });

});