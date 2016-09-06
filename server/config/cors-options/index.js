'use strict';

const config = require('../environment');

function getHostname(origin) {
  if (origin) {
    let start = origin.indexOf('://') + 3;
    if (start > 3) {
      let end = origin.indexOf('/', start);
      if (end < 0) { end = origin.length; }
      return origin.substring(start, end);
    }
  }
  return '';
}

function isSupported(origin, cb) {
  if (config.cors.unrestricted) { return cb(null, true); }
  //supportedHostnames is a regex identifying the supported host names for cross-origin resource sharing requests. It matches against the origin host name
  let supportedHostnames = config.cors.supportedHostnames;
  cb(null, !!supportedHostnames && !!getHostname(origin).match(supportedHostnames));
}

module.exports = {
  origin: isSupported
};
