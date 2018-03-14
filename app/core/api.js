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
     * POST /api/user/login
     * log the user in and send their details
     */
    app.get('/api/user', function(req, res) {
        util.findOrCreate(req.user, function(err, user) {
            if (err) {
                if(err === -1) {
                    res.status(201).send('Created');
                }
                else {
                    console.log('Error: ' + err);
                }                
            } else if (user) {
                res.status(200).json(user);
            } else {
                res.status(500).send('error when retrieving user');
            }
        })
    })

    /**
     * GET /api/budget
     * get the latest user budget
     */
    app.get('/api/budget', function(req, res) {
        let id;
        util.getUserId(req.user, function(err, user) {
            id = user.id;
            util.query('SELECT budget FROM budget WHERE user = ? ORDER BY bdate DESC LIMIT 1', [id], function(results) {
                res.status(200).json(results[0].budget);
            });
        });
    })

    /**
     * POST /api/budget
     * update the user's budget with the provided value in the body
     */
    app.post('/api/budget', function(req, res) {
        let valiResult = util.validateBudget(req);
        //runs sql query if request has valid body values
        if (util.resultValid(valiResult)) {
            util.getUserId(req.user, function(err, user) {
                let id = user.id;
                util.query('SELECT budget FROM budget WHERE user = ? AND bdate = ?', [id, util.getFirstDayOfMonth()], function(results) {
                    if(results.length > 0) {
                        util.query('UPDATE budget SET budget = ? WHERE user = ? AND bdate = ?', [req.body.budget, id, util.getFirstDayOfMonth()], function(results) {
                            res.sendStatus(202);
                        });
                    }
                    else {
                        let cols = ['user', 'budget', 'bdate'];
                        let vals = [id, req.body.budget, util.getFirstDayOfMonth()];
                        util.query('INSERT INTO budget(??) values(?)', [cols, vals], function(results) {
                            res.sendStatus(201);
                        });
                    }
                })
            });
        } else {
            //returns input errors as res
            res.send(valiResult.error.message).status(400);
        }
    })

    /**
     * GET /api/transaction
     * get all user transactions
     * if month and year query is provided, records within that date will be provided
     * @param {Int} month  transaction Month
     * @param {Int} year  transaction Year
     */
    app.get('/api/transaction', function(req, res) {
        util.getUserId(req.user, function(err, user) {
            if (user) {
                let sql = `SELECT 
                transaction.id, transaction.amount, transaction.description, transaction.tdate AS date,
                category.cname AS category, category.icon, category.colour
                FROM transaction 
                INNER JOIN category 
                    ON transaction.category = category.id
                WHERE transaction.user = ? 
                    AND MONTH(transaction.tdate) = ?
                    AND YEAR(transaction.tdate) = ?`;
                let month = req.query.month ? req.query.month : new Date().getMonth() + 1;
                let year = req.query.year ? req.query.year : new Date().getFullYear();
                let inserts = [user.id, month, year];         

                util.query(sql, inserts, function(results) {
                        res.status(200).send(results);
                });
            } else {
                res.sendStatus(401);
            }
        })
    })

    /**
     * POST /api/transaction
     * create a new transaction
     */
    app.post('/api/transaction', function(req, res) {
        util.getUserId(req.user, function(err, user) {
            if (user) {
                let valiResult = util.validateTrans(req);
                //runs sql query if request has valid body values
                if (util.resultValid(valiResult)) {
                    let columns = ['user', 'amount', 'description', 'tdate', 'category', 'image']
                    let values = [user.id, req.body.amount, req.body.description, new Date(req.body.tdate), req.body.category, req.body.image]
                    util.query('INSERT into transaction(??) values (?)', [columns, values], function(results) {
                        res.sendStatus(201);
                    });
                } else {
                    //returns input errors as res
                    res.send(valiResult.error.message).status(400);
                }
            } else {
                res.sendStatus(401);
            }
        });
    })

    /**
     * GET /api/transaction/:id
     * @param {Int} id  transaction id
     * get the transaction with the specified id
     */
    app.get('/api/transaction/:id', function(req, res) {
        util.getUserId(req.user, function(err, user) {
            if (user) {
                let columns = ['id', 'amount', 'category', 'description', 'tdate', 'image']
                util.query(`SELECT 
                    transaction.id, transaction.amount, transaction.description, transaction.tdate AS date,
                    category.cname AS category, category.icon, category.colour
                    FROM transaction 
                    INNER JOIN category 
                        ON transaction.category = category.id
                    WHERE transaction.id = ?
                        AND transaction.user = ?`, [req.params.id, user.id], function(results) {
                    if (results.length > 0) {
                        res.status(200).send(results[0]);
                    } else {
                        res.sendStatus(404);
                    }
                });
            } else {
                res.sendStatus(401);
            }
        })
    })

    /**
     * POST /api/transaction/:id
     * update a transaction
     */
    app.post('/api/transaction/:id', function(req, res) {
        util.getUserId(req.user, function(err, user) {
            if (user) {
                let valiResult = util.validateTrans(req);
                //runs sql query if request has valid body values
                if (util.resultValid(valiResult)) {
                    let values = [req.body.amount, req.body.description, new Date(req.body.tdate), req.body.category, req.body.image]
                    util.query(`UPDATE transaction 
                            SET amout = ?, description = ?, tdate = ?, category = ?, image = ?
                            WHERE id = ? AND user = ?`, [values, req.body.id, user.id], function(results) {
                        res.sendStatus(200);
                    });
                } else {
                    //returns input errors as res
                    res.send(valiResult.error.message).status(400);
                }
            } else {
                res.sendStatus(401);
            }
        });
    })

    /**
     * DELETE /api/transaction/:id
     * @param {Int} id  transaction id
     * delete the transaction with the specified id
     */
    app.delete('/api/transaction/:id', function(req, res) {
        util.getUserId(req.user, function(err, user) {
            if (user) {
                util.query('DELETE FROM ?? WHERE ?? = ? AND ?? = ?', ['transaction', 'id', req.params.id, 'user', user.id], function(results) {
                    if (results.affectedRows > 0) {
                        res.status(200).send('Deleted');
                    } else {
                        res.sendStatus(404);
                    }
                });
            } else {
                res.sendStatus(401);
            }
        })
    })

    /**
     * GET /api/category
     * get all categories from the database
     */
    app.get('/api/category', function(req, res) {
        util.query('SELECT id, cname FROM category ORDER BY cname', [], function(results) {
            res.json(results);
        })
    })
}
