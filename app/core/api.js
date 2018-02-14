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

    /**
     * GET /api/user
     * get the current logged user details
     */
    app.get('/api/user/', function(req, res) {
        if(req.user) {
            util.findOrCreate(req.user, function(err,user){
                if(err){
                    console.log()
                    res.sendStatus(500);
                }else{
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
        if(req.user) {
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

    /**
     * POST /api/user/login
     * log the user in and send their details
     */
    app.post('/api/user/login', function(req, res) {
        console.log(req.user);
        if(req.user.id) {
            util.findOrCreate(req.user, function(err, user) {
                if(err) {
                    console.log('Error: ' + err);
                }
                else if(user) {
                    res.status(201).json(user);
                }
                else {
                    res.status(500).send('error when retrieving user');
                }
            })
        }
        else {
            res.sendStatus(403);
        }
    })

    /**
     * GET /api/budget
     * get the user budget
     */
    app.get('/api/budget', function(req, res) {
        if(req.user) {
            util.query('SELECT * from user where ??=?', ['email', req.user.emails[0].value], function(results) {
                res.status(200).send("" + results[0].budget);
            });
        }
    })

    /**
     * POST /api/budget/:budget
     * @param  {Int} budget  the budget value to be updated
     * update the user's budget with the provided value
     */
    app.post('/api/budget/:budget', function(req, res) {
        if(req.user) {
            util.query('UPDATE user SET ?? = ? WHERE ?? = ?', ['budget', req.params.budget, 'email', req.user.emails[0].value], function(results) {
                res.status(200).send(results[0]);
            });
        }
    })

    /**
     * GET /api/transaction
     * get all user transactions
     */
    app.get('/api/transaction', function(req, res){
        if(req.user){
            util.query('SELECT amount, discription, tdate, category, image FROM transaction, user WHERE ?? = ?', ['email', req.user.emails[0].value],
            function(results){
                res.status(200).send(results);
            });
        }
    })

    /**
     * POST /api/transaction
     * create a new transaction
     */
    app.post('/api/transaction', function(req,res){
        if(req.user){
            util.findOrCreate(req.user, function(err,user){
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                }else{
                    let columns = ['user', 'amount', 'description', 'tdate', 'category', 'image']
                    let values = [user.id, req.body.amount, req.body.description, req.body.date, req.body.category, req.body.image]
                    util.query('INSERT into transation(??) values (?)', columns, valuse, function(req,res){
                        res.sendStatus(200);
                    });
                }
            });
        }
    })

    /**
     * GET /api/transaction/:id
     * @param  {Int} id  transaction id
     * get the transaction with the specified id
     */
    app.get('/api/transaction/:id', function(req,res){
        if(req.user){
            util.query('SELECT amount, category, description, tdate, image FROM transation WHERE ?? = ? AND ?? = ?', ['id', req.perams.id, 'email', req.user.emails[0].value], function(results){
            res.status(200).send(results[0]);
             });
        }
    })

    /**
     * DELETE /api/transaction/:id
     * @param  {Int} id  transaction id
     * delete the transaction with the specified id
     */
    app.delete('/api/transation/:id', function(req,res){
        if(req.user){
            util.query('DELETE FROM transation WHERE ?? = ? AND ?? = ?', ['id', req.perams.id, 'email', req.user.emails[0].value], function(results){
                res.sendStatus(204);
            });
        }
    })    
}
