'use strict';

module.exports = {
  "definitions": {
    "integer-range": {
      "type": 'object',
      "required": ["min","max"],
      "properties": {
        "min": {
          "type": "number",
          "format": "int32",
          "description": "Minimum value"
        },
        "max": {
          "type": "number",
          "format": "int32",
          "description": "Maximum value"
        },
      }
    }
  }
};