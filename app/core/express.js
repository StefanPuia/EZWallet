'use strict';

// initialize the express app
const express = require('express');
const app = express();

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
    /**
     * serve all files from the public directory on the /public path
     */
    app.use('/public', express.static('public'));

    /**
     * GET /
     * serve landing page
     * @param  {Object} req  express request object
     * @param  {Object} res  express response object
     */
    app.get('/', function(req, res) {
		res.status(200).send('It\'s working!');;
    });
}