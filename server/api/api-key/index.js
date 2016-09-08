'use strict';

const router = require('express').Router();
const save = require('./save');

router.use(require('../access-control').middleware({ isAdmin: true }));
router.post('/', save('create'));
router.put('/', save('update'));
router.post('/search', require('./search'));
router.get('/:key', require('./get'));
router.delete('/:key', require('./remove'));

module.exports = {
  routes: router
};