'use strict';

// load the configuration file
const config = require('./app/config');

// initialize and start the express app
const express = require('./app/core/express');
express.start();
const app = express.getApp();

// start the express api
const api = require('./app/core/api')(app);

//logging all requests to console
app.use('/', (req, res, next) => { console.log(new Date(), req.method, req.url); next(); });

/**
 * GET *
 * get any undefined route responds with 404
 */
app.use(function (req, res, next) {
  res.status(404).send(`There is no "${req.path}" here!`)
})

// start listening on the specified port
app.listen(config.serverPort, function() {
    console.log(`Listening on ${config.serverPort}.`);
});
