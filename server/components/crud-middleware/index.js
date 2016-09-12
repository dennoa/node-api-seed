'use strict';

const _ = require('lodash');
const router = require('express').Router();
const defaultOptions = require('./options');

module.exports = options => {

  let opts = _.merge({}, defaultOptions, options);

  function get(req, res) {
    return opts.respond(res, opts.crud.get(req.params));
  }

  function remove(req, res) {
    return opts.respond(res, opts.crud.remove(req.params));
  }

  function crudSave(createOrUpdate) {

    function save(req) {
      return new Promise((resolve, reject)=> {
        opts.requestValidator.validate(req, opts[createOrUpdate].rules).then(() => {
          opts.crud[createOrUpdate](req.body).then(resolve, reject);
        }, reject);
      });
    }

    return (req, res) => {
      return opts.respond(res, save(req));
    };
  }

  function find(req) {
    return new Promise((resolve, reject)=> {
      opts.requestValidator.validate(req, opts.find.rules).then(() => {
        let controls = opts.find.getControls(req.body);
        opts.crud.find(opts.find.getConditions(req.body))
          .skip(controls.skip)
          .limit(controls.limit)
          .exec()
          .then(resolve, reject);
      }, reject);
    });
  }

  function crudFind(req, res) {
    return opts.respond(res, find(req));
  }

  router.post('/', crudSave('create'));
  router.put('/', crudSave('update'));
  router.post('/find', crudFind);
  router.get('/:key', get);
  router.delete('/:key', remove);

  return router;
};