'use strict';

const serverEvents = require('./index');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('server-events', ()=> {

  it('should notify listeners of server startup', ()=> {
    let listener = sinon.stub();
    serverEvents.onStartup(listener);
    serverEvents.notifyStartup();
    serverEvents.removeStartupListener(listener);
    expect(listener).to.have.been.called;
  });

  it('should allow server startup listeners to be removed', ()=> {
    let listener = sinon.stub();
    serverEvents.onStartup(listener);
    serverEvents.removeStartupListener(listener);
    serverEvents.notifyStartup();
    expect(listener).not.to.have.been.called;
  });

});