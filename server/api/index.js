'use strict';

const apiKey = require('../components/api-key');
const auth = require('./auth');

module.exports = (app)=> {
  // app.use('/api-key', auth.secure({ reslocal: 'userInfo' }), require('./api-key').routes);
  // app.use('/api-key', apiKey.validate({ isAdmin: true }), require('./api-key').routes);
  app.use('/api-key', require('./api-key').routes);
  app.use('/auth', auth.routes);
  app.use('/swagger', require('./swagger').routes);
};