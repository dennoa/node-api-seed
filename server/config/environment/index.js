'use strict';

const _ = require('lodash');
const ob = require('config-obfuscator')({ 
  filename: __dirname + '/ob.cfg', key: process.env.CONFIG_KEY || 'ap1s33d' 
});
const env = process.env.NODE_ENV || 'development';

const config = {
  mongo: {
    options: {
      db: {
        safe: true
      },
      config: {
        autoIndex: false
      }
    }
  },
  port: process.env.PORT || 9000,
  cors: {
    unrestricted: true,
    supportedHostnames: null
  }
};

module.exports = _.merge(config, require('./' + env), ob.get(env));
