'use strict';

const _ = require('lodash');
const errorResponses = require('../../swagger/error-responses');

const create = {
  "tags": ["user-admin"],
  "summary": "Create a user",
  "description": "Create a user",
  "parameters": [{
    "name": "user",
    "in": "body",
    "schema": {
      "$ref": "#/definitions/user-updateable"
    }
  }],
  "responses": _.merge(errorResponses({ exclude: '404' }), {
    "200": {
      "description": "User",
      "schema": {
        "$ref": "#/definitions/user"
      }
    }
  })
};

const get = {
  "tags": ["user-admin"],
  "summary": "Get a user by username",
  "description": "Get a user by username",
  "parameters": [{
    "name": "username",
    "in": "path",
    "description": "The username",
    "required": true,
    "type": "string"
  }],
  "responses": errorResponses({ exclude: '400' })
};

module.exports = {
  "tags": [
    { "name": "user-admin", "description": "user administration" }
  ],
  "paths": {
    "/user": {
      "post": create,
      "put": _.merge({}, create, {
        "summary": "Update a user",
        "description": "Update a user",
        "responses": errorResponses()
      })
    },
    "/user/find": {
      "post": {
        "tags": ["user-admin"],
        "summary": "Search for users",
        "description": "Search for users",
        "parameters": [{
          "name": "conditions",
          "in": "body",
          "schema": {
            "$ref": "#/definitions/user-search-conditions"
          }
        }],
        "responses": _.merge(errorResponses({ exclude: '404' }), {
          "200": {
            "description": "List of users",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/user"
              }
            }
          }
        })
      }
    },
    "/user/{username}": {
      "get": _.merge({}, get, {
        "responses": {
          "200": {
            "description": "User",
            "schema": {
              "$ref": "#/definitions/user"
            }
          }
        }
      }),
      "delete": _.merge({}, get, {
        "summary": "Delete a user",
        "description": "Delete a user",
        "responses": {
          "204": {
            "description": "Success"
          }
        }
      })
    }
  }
};
