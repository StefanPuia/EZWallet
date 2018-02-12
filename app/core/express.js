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
module.exports.start = function(passport) {
    //serve all files from the public directory on the /public path
    app.use('/public', express.static('public'));

    // set the view engine and the view folder
    app.set('view engine', 'ejs');
    app.set('views', config.views);

    // use the passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

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

    /**
     * GET /auth/google
     * send authentication request to google oauth server
     */
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

    /**
     * GET /auth/google/callback
     * handle the authentication callback from google
     */
    app.get( '/auth/google/callback', 
        passport.authenticate( 'google', {
            failureRedirect: '/login'
        }), function (req, res) {
            res.redirect('/?usertoken=' + req.user.token + '&user=' + req.user.token);
        }
    );
}

