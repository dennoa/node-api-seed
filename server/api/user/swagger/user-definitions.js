'use strict';

const _ = require('lodash');
const searchControls = require('../../../components/search-controls');

const userUpdateable = {
  "type": "object",
  "description": "User",
  "properties": {
    "username": {
      "type": "string",
      "description": "The username"
    },
    "email": {
      "type": "string",
      "description": "Email address"
    },
    "name": {
      "type": "string",
      "description": "Name"
    },
    "picture": {
      "type": "string",
      "description": "Picture url"
    },
    "isAdmin": {
      "type": "boolean",
      "description": "Whether or not this user has administrator access"
    }
  }
};

const user = _.merge({}, userUpdateable, {
  "properties": {
    "since": {
      "type": "string",
      "format": "date-time",
      "description": "The user has been registered since this date"
    }
  }
});

const userCreatable = _.merge({}, userUpdateable, {
  "properties": {
    "password": {
      "type": "string",
      "description": "The password for this user"
    }
  }
});

module.exports = {
  "definitions": {
    "user": user,
    "user-updateable": userUpdateable,
    "user-createable": userCreatable,
    "user-search-conditions": _.merge({}, user, {
      "description": "Search for users",
      "properties": _.merge({
        "username": {
          "description": "Look for users that match. Partial match is supported"
        },
        "email": {
          "description": "Look for users that match. Partial match is supported"
        },
        "name": {
          "description": "Look for users that match. Partial match is supported"
        },
        "picture": {
          "description": "Look for users that match. Partial match is supported"
        },
        "since": {
          "description": "Look for users that registered on or after this date/time"
        }
      }, searchControls.swaggerProperties)
    })
  }
};
