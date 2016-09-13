'use strict';

const _ = require('lodash');

module.exports = _.merge(
  require('./user-paths'), 
  require('./user-definitions')
);
