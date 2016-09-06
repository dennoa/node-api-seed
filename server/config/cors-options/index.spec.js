'use strict';

const corsOptions = require('./index');
const config = require('../environment');
const expect = require('chai').expect;

describe('cors options', ()=> {

  let originalSupportedHostnames, originalUnrestricted;

  before(()=> {
    originalSupportedHostnames = config.cors.supportedHostnames;
    originalUnrestricted = config.cors.unrestricted;
  });

  after(()=> {
    config.cors.supportedHostnames = originalSupportedHostnames;
    config.cors.unrestricted = originalUnrestricted;
  });

  beforeEach(()=> {
    config.cors.supportedHostnames = /my-awesome-app\.com\.au|my-other-awesome-app\.com\.au/;
    config.cors.unrestricted = false;
  });

  it('should use the configured supported host names to allow access', (done)=> {
    corsOptions.origin('https://my-awesome-app.com.au/', (err, isOk)=> {
      expect(isOk).to.be.true;
      done();
    });
  });

  it('should allow access to supported origins with no path info', (done)=> {
    corsOptions.origin('https://my-awesome-app.com.au', (err, isOk)=> {
      expect(isOk).to.be.true;
      done();
    });
  });

  it('should allow access to supported origins with a port', (done)=> {
    config.cors.supportedHostnames = /my-awesome-app\.com\.au:8080/;
    corsOptions.origin('https://my-awesome-app.com.au:8080', (err, isOk)=> {
      expect(isOk).to.be.true;
      done();
    });
  });

  it('should use the configured origin whitelist to deny access', (done)=> {
    corsOptions.origin('https://my-terrible-app.com.au/', (err, isOk)=> {
      expect(isOk).to.be.false;
      done();
    });
  });

  it('should deny access when no origin whitelist is configured', (done)=> {
    config.cors.supportedHostnames = null;
    corsOptions.origin('https://my-awesome-app.com.au/', (err, isOk)=> {
      expect(isOk).to.be.false;
      done();
    });
  });

  it('should deny access when no origin is provided', (done)=> {
    corsOptions.origin(null, (err, isOk)=> {
      expect(isOk).to.be.false;
      done();
    });
  });

  it('should deny access when an invalid origin is provided', (done)=> {
    corsOptions.origin('some/crap', (err, isOk)=> {
      expect(isOk).to.be.false;
      done();
    });
  });

  it('should allow access to all when configured to be unrestricted', (done)=> {
    config.cors.unrestricted = true;
    corsOptions.origin('https://any-old-app.com.au/', (err, isOk)=> {
      expect(isOk).to.be.true;
      done();
    });
  });

});