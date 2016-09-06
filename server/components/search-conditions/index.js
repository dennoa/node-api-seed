'use strict';

const _ = require('lodash');

const transformers = {
  exact: {
    key: (key => key),
    value: (key, value) => { return value; }
  },
  gte: {
    key: (key => key),
    value: (key, value) => { return { $gte: value }; }
  },
  lte: {
    key: (key => key),
    value: (key, value) => { return { $lte: value }; }
  },
  lte_or_missing: {
    key: (key => '$or'),
    value: (key, value) => { return [_.set({}, key, { $lte: value }), _.set({}, key, { $exists: false })]; }
  },
  like: {
    key: (key => key),
    value: (key, value) => { return new RegExp(value, 'i'); }
  },
  upper: {
    key: (key => key),
    value: (key, value) => { return value.toUpperCase(); }
  },
  range: {
    key: (key => '$and'),
    value: (key, value, oldValue) => {
      let newValue = [_.set({}, key, { $lte: value.max }), _.set({}, key, { $gte: value.min })];
      return (oldValue) ? oldValue.concat(newValue) : newValue;
    }
  }
};

module.exports = (searchParameters)=> {
  return {
    get: (params)=> {
      return _.transform(params, (result, value, key) => {
        if (searchParameters[key]) {
          let transformer = transformers[searchParameters[key]];
          result[transformer.key(key)] = transformer.value(key, value, result[transformer.key(key)]);
        }
      }, {});
    }
  };
};