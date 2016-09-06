'use strict';

const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, index: true, unique: true },
  dateFrom: { type: Date, default: Date.now },
  dateTo: Date,
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('ApiKey', ApiKeySchema);