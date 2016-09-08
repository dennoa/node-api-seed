'use strict';

const _ = require('lodash');
const apiKey = require('../../../components/api-key');

const swagger = _.merge(
  require('./api-key-paths'), 
  require('./api-key-definitions')
);

module.exports = req => {
  return new Promise(resolve => {
    apiKey.validate(req)
      .then(apiDoc => resolve(apiDoc.isAdmin ? swagger : null))
      .catch(() => resolve(null));
  });
}
