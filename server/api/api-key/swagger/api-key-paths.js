'use strict';

const _ = require('lodash');
const errorResponses = require('../../swagger/error-responses');

const create = {
  "tags": ["api-key-admin"],
  "summary": "Create an api key",
  "description": "Create an api key",
  "parameters": [{
    "name": "apiKey",
    "in": "body",
    "schema": {
      "$ref": "#/definitions/api-key"
    }
  }],
  "responses": _.merge(errorResponses({ exclude: '404' }), {
    "200": {
      "description": "Api Key",
      "schema": {
        "$ref": "#/definitions/api-key"
      }
    }
  })
};

const get = {
  "tags": ["api-key-admin"],
  "summary": "Get an api key",
  "description": "Get an api key",
  "parameters": [{
    "name": "key",
    "in": "path",
    "description": "The api key value",
    "required": true,
    "type": "string"
  }],
  "responses": errorResponses({ exclude: '400' })
};

module.exports = {
  "tags": [
    { "name": "api-key-admin", "description": "api key administration" }
  ],
  "paths": {
    "/api-key": {
      "post": create,
      "put": _.merge({}, create, {
        "summary": "Update an api key",
        "description": "Update an api key",
        "responses": errorResponses()
      })
    },
    "/api-key/find": {
      "post": {
        "tags": ["api-key-admin"],
        "summary": "Search for an api key",
        "description": "Search for an api key",
        "parameters": [{
          "name": "conditions",
          "in": "body",
          "schema": {
            "$ref": "#/definitions/api-key-search-conditions"
          }
        }],
        "responses": _.merge(errorResponses({ exclude: '404' }), {
          "200": {
            "description": "List of API keys",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/api-key"
              }
            }
          }
        })
      }
    },
    "/api-key/{key}": {
      "get": _.merge({}, get, {
        "responses": {
          "200": {
            "description": "Api Key",
            "schema": {
              "$ref": "#/definitions/api-key"
            }
          }
        }
      }),
      "delete": _.merge({}, get, {
        "summary": "Delete an api key",
        "description": "Delete an api key",
        "responses": {
          "204": {
            "description": "Success"
          }
        }
      })
    }
  }
};
