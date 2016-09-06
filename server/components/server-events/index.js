'use strict';

const EventEmitter = require('events');

class ServerEvents extends EventEmitter {};

const serverEvents = new ServerEvents();

module.exports = {
  notifyStartup: () => { serverEvents.emit('startup'); },
  onStartup: (listener) => { serverEvents.on('startup', listener); },
  removeStartupListener: (listener) => { serverEvents.removeListener('startup', listener); }
};
