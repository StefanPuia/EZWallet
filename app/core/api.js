'use strict';

// load the config file
const config = require('./../config');

// initialise the utility functions
const util = require('./utility'); 

// initialise the json http request body parser
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
     */
	app.get('/api', function(req, res) {
        res.status(200).send('API is working!');
    })

    app.get('/api/user/:token', function(req, res) {
        util.query('SELECT * from user WHERE ?? = ?', ['token', req.query.token], function(user) {
            if(user.length > 0) {
                util.query('SELECT * from user WHERE ?? = ?', ['token', req.params.token], function(results) {
                    if(results.length > 0) {
                        res.status(200).json(results);
                    }
                    else {
                        res.status(200).json({err: 'requested user not found'});
                    }
                });
            }
            else {
                res.status(200).json({err: 'requesting user not found'});
            }
        })
    })

    // app.get('/api/budget', function(req, res) {
    //     util.query('SELECT * from user', function(results) {
    //         res.status(200).send(results);
    //     });
    // })
}