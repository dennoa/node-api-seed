'use strict';

const express = require('express');
const path = require('path');

module.exports = (app)=> {
  app.set('trust proxy', true);
  app.use(require('cors')(require('./cors-options')));
  app.use(require('body-parser').json());
  app.use(require('compression')());
  app.use(express.static(path.normalize(__dirname + '/../../client')));
};