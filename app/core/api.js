'use strict';

// load local modules
const config = require('./../config');
const util = require('./utility');

// load installed modules
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');
const sha256 = require('sha256');

/**
 * express API
 * @param {Object} app  the express app object
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
    app.use('/api', GoogleAuth.guardMiddleware({
        realm: 'jwt'
    }));

    /**
     * GET /api
     * test function
     */
    app.get('/api', function(req, res) {
        res.status(200).send('API is working!');
    })

    /**
     * GET /api/user
     * get the current logged user details
     */
    app.get('/api/user/', function(req, res) {
        if (req.user) {
            util.findOrCreate(req.user, function(err, user) {
                if (err) {
                    console.log()
                    res.sendStatus(500);
                } else {
                    res.status(200).json(user);
                }
            });
        }
    })

    /**
     * GET /api/user/:id
     * @param {Int} id  user id
     * get the details of user with specified id
     */
    app.get('/api/user/:id', function(req, res) {
        if (req.user) {
            let columns = [];
            Object.keys(req.query).forEach(function(key) {
                if (req.query[key] == 'true') {
                    columns.push(key);
                }
            })
            util.query('SELECT ?? from ?? WHERE ?? = ?', [columns, 'user', 'id', req.params.id], function(user) {
                if (user.length > 0) {
                    res.status(200).json(user[0]);
                } else {
                    res.sendStatus(404);
                }
            })
        }
    })

    /**
     * POST /api/user/login
     * log the user in and send their details
     */
    app.post('/api/user/login', function(req, res) {
        if (req.user.id) {
            util.findOrCreate(req.user, function(err, user) {
                if (err) {
                    console.log('Error: ' + err);
                } else if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(500).send('error when retrieving user');
                }
            })
        } else {
            res.sendStatus(403);
        }
    })

    /**
     * GET /api/budget
     * get the user budget
     */
    app.get('/api/budget', function(req, res) {
        if (req.user) {
            util.query('SELECT ?? from ?? where ??=?', ['budget', 'user', 'email', req.user.emails[0].value], function(results) {
                if(results.length > 0) {
                    res.status(200).send("" + results[0].budget);
                }
                else {
                    res.sendStatus(404);
                }
            });
        }
    })

    /**
     * POST /api/budget
     * update the user's budget with the provided value in the body
     */
    app.post('/api/budget', function(req, res) {
        if (req.user) {
            util.query('UPDATE ?? SET ?? = ? WHERE ?? = ?', ['user', 'budget', req.body.budget, 'email', req.user.emails[0].value], function(results) {
                res.sendStatus(202);
            });
        }
    })

    /**
     * GET /api/transaction
     * get all user transactions
     */
    app.get('/api/transaction', function(req, res) {
        if (req.user) {
            util.getUserId(req.user, function(err, user) {
                if(user) {
                    let columns = ['id', 'amount', 'description', 'tdate', 'category', 'image'];
                    util.query('SELECT ?? FROM ?? WHERE ?? = ?', [columns, 'transaction', 'user', user.id] ,function(results) {
                        if(results.length > 0) {
                            res.status(200).send(results);
                        }
                        else {
                            res.sendStatus(404);
                        }
                    });
                }
                else {
                    res.sendStatus(401);
                }
            })   
        }
    })

    /**
     * POST /api/transaction
     * create a new transaction
     */
    app.post('/api/transaction', function(req, res) {
        if (req.user) {
            util.getUserId(req.user, function(err, user) {
                if(user) {
                    let columns = ['id', 'user', 'amount', 'description', 'tdate', 'category', 'image']
                    let values = [user.id, req.body.amount, req.body.description, req.body.tdate, req.body.category, req.body.image]
                    util.query('INSERT into transaction(??) values (?)', [columns, values], function(results) {
                        res.sendStatus(201);
                    });
                }
                else {
                    res.sendStatus(401);
                }
            });
        }
    })

    /**
     * GET /api/transaction/:id
     * @param {Int} id  transaction id
     * get the transaction with the specified id
     */
    app.get('/api/transaction/:id', function(req, res) {
        if (req.user) {
            util.getUserId(req.user, function(err, user) {
                if(user) {
                    let columns = ['id', 'amount', 'category', 'description', 'tdate', 'image']
                    util.query('SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?', [columns, 'transaction', 'id', req.params.id, 'user', user.id], function(results) {
                        if(results.length > 0) {
                            res.status(200).send(results[0]);
                        }
                        else {
                            res.sendStatus(404);
                        }
                    });
                }
                else {
                    res.sendStatus(401);
                }
            })
        }
    })

    /**
     * DELETE /api/transaction/:id
     * @param {Int} id  transaction id
     * delete the transaction with the specified id
     */
    app.delete('/api/transaction/:id', function(req, res) {
        if (req.user) {
            util.getUserId(req.user, function(err, user) {
                if(user) {
                    util.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ['transaction', 'id', req.params.id, 'user', user.id], function(results) {
                        if(results.affectedRows > 0) {
                            res.status(200).send('Deleted');
                        }
                        else {
                            res.sendStatus(404);
                        }
                    });
                }
                else {
                    res.sendStatus(401);
                }
            })
        }
    })
}