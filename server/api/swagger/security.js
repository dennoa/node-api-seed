'use strict';

module.exports = {
  "securityDefinitions": {
    "apiKey": {
      "type": "apiKey",
      "description": "API key",
      "name": "x-iag-api-key",
      "in": "header"
    },
    "authorizationHeader": {
      "type": "apiKey",
      "description": "For authenticated requests, the Authorization Header contains: Bearer {{JWT}}",
      "name": "Authorization",
      "in": "header"
    }
  },
  "security": [{
    "x-iag-api-key": [],
    "Authorization": []
  }]
};