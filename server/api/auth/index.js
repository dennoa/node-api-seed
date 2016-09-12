'use strict';

const config = require('../../config/environment');
const user = require('../../components/user');

module.exports = require('stateless-auth')({
  jwt: { 
    secret: config.auth.jwt.secret 
  },
  providers: {
    login: {
      findUser: (credentials => user.get({ username: credentials.username }))
    }
  },
  swagger: {
    pathPrefix: '/auth',
    docs: {
      basePath: '/'
    }
  }
});
