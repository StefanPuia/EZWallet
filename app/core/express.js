'use strict';

// initialise the express app
const express = require('express');
const app = express();

// initialise the sha256 module
const sha256 = require('sha256');

// initialise the configuration file
const config = require('./../config');

/**
 * return the express app
 * @return {Object} app  the express app object
 */
module.exports.getApp = function() {
    return app;
}

/**
 * start the express server
 */
module.exports.start = function() {
    //serve all files from the public directory on the /public path
    app.use(config.public.routed, express.static(config.public.local));

    // set the view engine and the view folder
    app.set('view engine', 'ejs');
    app.set('views', config.views);

    /**
     * GET /
     * serve landing page
     */
    app.get('/', function(req, res) {
        res.status(200).render('index');
    });

    /**
     * GET /login
     * serve the login page
     */
    app.get('/login', function(req, res) {
        res.status(200).render('login')
    })    
}

