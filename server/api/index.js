'use strict';

module.exports = (app)=> {
  app.use(require('../components/request-validator').middleware());
  app.use('/api-key', require('./api-key').routes);
  app.use('/auth', require('./auth').routes);
  app.use('/swagger', require('./swagger').routes);
};