'use strict';

// load local modules
const config = require('./../config');
const util = require('./utility');

// load public modules
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');
const sha256 = require('sha256');

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

    // use the google auth middleware
    app.use(GoogleAuth(config.googleAuth.clientID));

    // return 'Not authorized' if we don't have a user
    app.use('/api', GoogleAuth.guardMiddleware({ realm: 'jwt' }));

    /**
     * GET /api
     * test function
     */
    app.get('/api', function(req, res) {
        res.status(200).send('API is working!');
    })

    app.get('/api/user/:id', function(req, res) {
        if(req.user.id) {
            util.query('SELECT * from user WHERE ?? = ?', ['id', req.params.id], function(user) {
                if (user.length > 0) {
                    Object.keys(req.query).forEach(function(key) {
                        if(req.query[key] == 'false') {
                            delete user[0][key];
                        }
                    })
                    res.status(200).json(user[0]);
                }
                else {
                    res.status(200).json({err: 'user not found'});
                }
            })
        }
    })

    app.get('/api/user/', function(req, res) {
        if(req.user) {
            util.query('SELECT * from user WHERE ?? = ?', ['email', req.user.emails[0].value], function(user) {
                if (user.length > 0) {
                    Object.keys(req.query).forEach(function(key) {
                        if(req.query[key] == 'false') {
                            delete user[0][key];
                        }
                    })
                    res.status(200).json(user[0]);
                }
                else {
                    res.status(200).json({err: 'user not found'});
                }
            })
        }
    })

    app.get('/api/budget', function(req, res) {
        if(req.user) {
            util.query('SELECT * from user where ??=?', ['email', req.user.emails[0].value], function(results) {
                res.status(200).send("" + results[0].budget);
            });
        }
    })

    app.post('/api/budget/:budget', function(req, res) {
        if(req.user) {
            util.query('UPDATE user SET ?? = ? WHERE ?? = ?', ['budget', req.params.budget, 'email', req.user.emails[0].value], function(results) {
                res.status(200).send(results[0]);
            });
        }
    })

    app.get('/api/transaction', function(req, res){
        if(req.user){
            util.query('SELECT amount, discription, tdate, category, image FROM transaction, user WHERE ?? = ?', ['email', req.user.emails[0].value],
            function(results){
                res.status(200).send(results);
            });
        }
    })

    app.get('/api/transaction/:id', function(res,req){
        if(req.user){
            util.query('SELECT amount, category, description, tdate, image FROM transation WHERE ?? = ? AND ?? = ?', ['id', req.perams.id, 'email', req.user.emails[0].value], function(results){
                res.status(200).send(results[0]);
            });
        }
    })

    app.delete('/api/transation/:id', function(res,req){
        if(req.user){
            util.query('DELETE FROM transation WHERE ?? = ? AND ?? = ?', ['id', req.perams.id, 'email', req.user.emails[0].value], function(results){
                res.sendStatus(204);
            });
        }
    })

    app.post('/api/transaction', function(req,res){

    })

    app.post('/user/login', function(req, res) {
        console.log(req.user);
        if(req.user.id) {
            util.findOrCreate(req.user, function(err, user) {
                if(err) {
                    console.log('Error: ' + err);
                }
                else {
                    console.log(user);
                    if(user) {
                        res.status(201).send('user found!');
                    }
                    else {
                        res.status(201).send('user created!');
                    }
                }
            })
        }
        else {
            res.sendStatus(403);
        }
    })
}
