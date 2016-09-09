'use strict';

const apiKey = require('../components/api-key');

module.exports = (app)=> {
  app.use('/api-key', apiKey.validate({ isAdmin: true }), require('./api-key').routes);
  app.use('/auth', require('./auth').routes);
  app.use('/swagger', require('./swagger').routes);
};