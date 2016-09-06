'use strict';

const _ = require('lodash');

module.exports = _.merge(
  require('./api-key-paths'), 
  require('./api-key-definitions')
);
