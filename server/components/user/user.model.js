'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, sparse: true },
  passwordHash: String,
  ids: {
    facebook: { type: String, index: true, sparse: true },
    github: { type: String, index: true, sparse: true },
    google: { type: String, index: true, sparse: true },
    linkedin: { type: String, index: true, sparse: true }
  },
  email: String,
  name: String,
  picture: String,
  isAdmin: { type: Boolean, default: false },
  since: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);