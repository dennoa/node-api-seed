'use strict';

module.exports = {
  respond: (res, promise) => res.status(500).send('Please provide a crud response handler'),
  validateRequest: (req, validationRules) => new Promise(resolve => resolve()),
  create: {
    rules: {}
  },
  update: {
    rules: {}
  },
  find: {
    rules: {},
    getControls: () => {
      return {
        skip: 0,
        limit: 20
      };
    },
    getConditions: () => null
  }
};