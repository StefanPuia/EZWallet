'use strict';

// initialize the utility functions
const util = require('./utility'); 

// initialize the json http request body parser
const bodyParser = require('body-parser');

/**
 * express API
 * @param  {Object} app  the express app object
 */
module.exports = function(app) {
    // json parser for http requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    /**
     * GET /api
     * test function
     * @param  {Object} req  express request object
     * @param  {Object} res  express response object
     */
	app.get('/api', function(req, res) {
        res.status(200).send('API is working!');
    })
}