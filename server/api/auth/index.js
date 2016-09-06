'use strict';

const config = require('../../config/environment');

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
        //TODO: Lookup user info and callback
        //e.g. UserModel.findOne({ username: credentials.username }, callback);
        callback(null, null);
      }
    }
  }
});
