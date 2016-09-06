'use strict';

const config = require('./config/environment');
const serverEvents = require('./components/server-events');
const apiKey = require('./components/api-key');
const logger = require('./components/logger');

module.exports = () => {
  serverEvents.onStartup(() => {
    logger.info('Listening on port %s', config.port);
    apiKey.ensureAnAdminApiKeyIsAvailable();
  });
};
