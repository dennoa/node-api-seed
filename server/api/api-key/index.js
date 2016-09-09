'use strict';

const router = require('express').Router();
const save = require('./save');
const swagger = require('./swagger');

router.use(require('./request-validator').prepare());
router.post('/', save('create'));
router.put('/', save('update'));
router.post('/search', require('./search'));
router.get('/:key', require('./get'));
router.delete('/:key', require('./remove'));

module.exports = {
  routes: router,
  swagger: swagger
};