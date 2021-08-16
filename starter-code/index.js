'use strict';

// Start up DB Server
require('dotenv').config();
const { db } = require('./src/auth/models/index.js');
db.sync()
  .then(() => {

    // Start the web server
    require('./src/server.js').startup(process.env.PORT);
  });

