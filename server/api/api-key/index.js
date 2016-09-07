'use strict';

const router = require('express').Router();
const validate = require('./validate');
const save = require('./save');

router.use(validate.forAdmin);
router.post('/', save('create'));
router.put('/', save('update'));
router.post('/search', require('./search'));
router.get('/:key', require('./get'));
router.delete('/:key', require('./remove'));

module.exports = {
  routes: router,
  validate: validate
};