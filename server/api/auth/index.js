'use strict';

const config = require('../../config/environment');
const user = require('../../components/user');

module.exports = require('stateless-auth')({
  jwt: { 
    secret: config.auth.jwt.secret 
  },
  providers: {
    github: { 
      clientSecret: 'CLIENT_SECRET' 
    },
    login: {
      findUser: (credentials, callback) => {
        user.findByUsername(credentials.username, callback);
      }
    }
  }
});
