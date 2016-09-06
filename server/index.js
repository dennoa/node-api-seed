'use strict';

const config = require('./config/environment');
const app = require('express')();
const mongoose = require('mongoose');
const serverEvents = require('./components/server-events');

mongoose.Promise = Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);

require('./config/express')(app);
require('./api')(app);
require('./register-server-event-listeners')();

app.listen(config.port, serverEvents.notifyStartup);