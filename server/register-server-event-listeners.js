'use strict';

const auth = require('./api/auth');
const config = require('./config/environment');
const serverEvents = require('./components/server-events');
const apiKey = require('./components/api-key');
const logger = require('./components/logger');
const user = require('./components/user');

module.exports = () => {
  serverEvents.onStartup(() => {
    logger.info('Listening on port %s', config.port);
    apiKey.ensureAnApiKeyIsAvailable({ isAdmin: true }).catch(err => {
      logger.error('Failed to create an admin api key', err);
    });
    user.setHashPassword(auth.options.providers.login.hashPassword);
  });
};
