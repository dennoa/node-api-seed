'use strict';

const router = require('express').Router();
const swagger = require('./swagger');

router.use(require('./request-validator').prepare());
router.use(require('./crud-middleware'));

module.exports = {
  routes: router,
  swagger: swagger
};