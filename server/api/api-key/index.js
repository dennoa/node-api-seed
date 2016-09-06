'use strict';

const router = require('express').Router();
const validate = require('./validate');
const save = require('./save');

router.post('/', validate.forAdmin, save('create'));
router.put('/', validate.forAdmin, save('update'));
router.post('/search', validate.forAdmin, require('./search'));
router.get('/:key', validate.forAdmin, require('./get'));
router.delete('/:key', validate.forAdmin, require('./remove'));

module.exports = {
  routes: router,
  validate: validate
};