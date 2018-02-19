'use strict';

// load the configuration file
const config = require('./app/config');

// initialize and start the express app
const express = require('./app/core/express');

// start the express api
const api = require('./app/core/api')(express);

// send a 404 status for any undefined routes
express.use(function(req, res, next) {
    res.status(404).send(`There is no "${req.path}" here!`)
})

// start listening on the specified port
express.listen(config.serverPort, function() {
    console.log(`Listening on ${config.serverPort}.`);
});