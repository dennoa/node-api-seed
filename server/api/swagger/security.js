'use strict';

module.exports = {
  "securityDefinitions": {
    "apiKey": {
      "type": "apiKey",
      "description": "API key",
      "name": "x-iag-api-key",
      "in": "header"
    }
  },
  "security": [{
    "x-iag-api-key": []
  }]
};