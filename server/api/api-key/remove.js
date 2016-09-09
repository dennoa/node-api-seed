'use strict';

const respond = require('../../components/respond-without-id-and-version');
const apiKey = require('../../components/api-key');

module.exports = (req, res)=> {
  return respond(res, apiKey.remove(req.params.key));
};