'use strict';

// load local modules
const config = require('./../config');

// load installed modules
const sha256 = require('sha256');
const express = require('express');

// initialise the express app
const app = express();

// export the express app
module.exports = app;

//serve all files from the public directory on the /public path
app.use(config.public.routed, express.static(config.public.local));

// set the view engine and the view folder
app.set('view engine', 'ejs');
app.set('views', config.views);

// log all requests to console
app.use('/', (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    console.log(new Date(), ip, req.method, req.url);
    next();
});

/**
 * GET /
 * serve landing page
 */
app.get('/', function(req, res) {
    res.status(200).render('dashboard');
});

/**
 * GET /login
 * serve the login page
 */
app.get('/login', function(req, res) {
    res.status(200).render('login')
})

/**
 * GET /records
 * serve the records page
 */
app.get('/records', function(req, res) {
    res.status(200).render('records')
})

/**
 * GET /settings
 * serve the settings page
 */
app.get('/settings', function(req, res) {
    res.status(200).render('settings')
})

/**
 * GET /search
 * serve the search page
 */
app.get('/search', function(req, res) {
    res.status(200).render('search')
})

/**
 * GET /edit
 * serve the add page
 */
app.get('/edit', function(req, res) {
    res.status(200).render('edit')
})

/**
 * GET /edit/:id
 * serve the edit page
 */
app.get('/edit/:id', function(req, res) {
    res.status(200).render('edit')
})