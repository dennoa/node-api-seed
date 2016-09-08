'use strict';

const _ = require('lodash');
const accessControl = require('../../access-control');

const swagger = _.merge(
  require('./api-key-paths'), 
  require('./api-key-definitions')
);

module.exports = res => {
  return new Promise(resolve => {
    accessControl.validate(res, { isAdmin: true })
      .then(() => resolve(swagger))
      .catch(() => resolve(null));
  });
}
