'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, unique: true },
  passwordHash: String,
  email: String,
  name: String,
  picture: String,
  since: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);