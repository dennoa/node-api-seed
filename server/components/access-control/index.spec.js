'use strict';

const expect = require('chai').expect;
const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const accessControl = require('./index');

describe('access-control', ()=> {

  let accessControlInstance, router;

  beforeEach(()=> {
    accessControlInstance = accessControl();
    router = express.Router();
  });

  function request(method, path) {
    let app = express();
    app.use(bodyParser.json());
    app.use(accessControlInstance.init());
    app.use('/api', router);
    return supertest(app)[method](path).set('Accept', 'application/json');
  }

  it('should allow access', (done)=> {
    router.get('/public', accessControlInstance.middleware(), (req, res)=>res.status(200).json());
    request('get', '/api/public').send().end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should deny access', (done)=> {
    router.get('/secure', accessControlInstance.middleware({ isAdmin: true }), (req, res)=>res.status(200).json());
    request('get', '/api/secure').send().end((err, res) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

});