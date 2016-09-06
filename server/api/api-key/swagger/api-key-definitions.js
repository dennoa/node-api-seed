'use strict';

const _ = require('lodash');
const searchControls = require('../../../components/search-controls');

const apiKey = {
  "type": "object",
  "description": "Api Key",
  "properties": {
    "key": {
      "type": "string",
      "description": "The api key"
    },
    "dateFrom": {
      "type": "string",
      "format": "date-time",
      "description": "The key is valid from this date/time"
    },
    "dateTo": {
      "type": "string",
      "format": "date-time",
      "description": "The key is valid to this date/time"
    },
    "isAdmin": {
      "type": "boolean",
      "description": "Whether or not this key can be used for admin operations"
    }
  }
};

module.exports = {
  "definitions": {
    "api-key": apiKey,
    "api-key-search-conditions": _.merge({}, apiKey, {
      "description": "Search for API keys",
      "properties": _.merge({
        "key": {
          "description": "Look for API keys that match. Partial match is supported"
        },
        "dateFrom": {
          "description": "Look for API keys that became effective on or after this date/time"
        },
        "dateTo": {
          "description": "Look for API keys that expired on or before this date/time"
        }
      }, searchControls.swaggerProperties)
    })
  }
};
