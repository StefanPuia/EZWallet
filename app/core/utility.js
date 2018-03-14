'use strict';

// load local modules
const config = require('./../config');

// load installed modules
const sha256 = require('sha256');
const mysql = require('mysql');
const Joi = require('joi');

/**
 * handle the sql server disconnect and reconnect if required
 */
let mysqlConnection;

function handleDisconnect() {
    mysqlConnection = mysql.createConnection(config.database);

    mysqlConnection.connect(function(err) {
        if (err) {
            console.log('Error when connecting to the database server. Reconnecting in 2 seconds...');
            setTimeout(handleDisconnect, 2000);
        }
    });

    mysqlConnection.on('error', function(err) {
        // console.log('Database server closed connection. Reconnecting...');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

/**
 * execute a mysql query
 * @param {String} query  query to be executed
 * @param {Array} columns  array of columns to be used in query
 * @param {Array} values  array of values to be inserted in query
 * @param {Function} callback  the callback function for async query
 */
module.exports.query = function(query, insert, callback) {
    mysqlConnection.query(query, insert, function(error, results, fields) {
        if (error) throw error;
        callback(results);
    })
}

/**
 * find or create a new user based on the provided email/profile
 * @param  {Object} profile  openid profile object
 * @param  {Function} callback  the callback function for async query
 */
module.exports.findOrCreate = function(profile, callback) {
    mysqlConnection.query("SELECT * FROM ?? WHERE ?? = ?", ['user', 'email', profile.emails[0].value],
        function(error, results, fields) {
            if (error) {
                throw error;
                callback(error);
            } else if (results.length == 0) {
                console.log('not found, inserting');
                let user = {
                    fname: profile.name.givenName,
                    lname: profile.name.familyName,
                    email: profile.emails[0].value
                }
                mysqlConnection.query('INSERT INTO user SET ?', user, function(err, newUser) {
                    if(err) throw err;
                    user.id = newUser.insertId;

                    let budget = {
                        user: user.id,
                        bdate: exports.getFirstDayOfMonth(),
                        budget: 0
                    }
                    mysqlConnection.query('INSERT INTO budget SET ?', budget, function(err, newBudget) {
                        callback(-1, user);
                    })                    
                })
                
            } else {
                callback(null, results[0]);
            }
        }
    )
}

/**
 * get user id from profile or create user and callback with id
 * @param {Object} profile  openid profile object
 * @param {Function} callback  the callback function for async query
 */
module.exports.getUserId = function(profile, callback) {
    mysqlConnection.query("SELECT ?? FROM ?? WHERE ?? = ?", ['id', 'user', 'email', profile.emails[0].value],
        function(error, results, fields) {
            if (error) throw error;
            if (results.length == 0) {
                callback(null, false);
            } else {
                callback(null, results[0]);
            }
        }
    )
}

//Validation Schemas
const postTransSchema = Joi.object().keys({
    amount: Joi.number().precision(2).required(),
    description: Joi.string().max(100).optional(),
    tdate: Joi.date().max('now').required(),
    category: Joi.number().integer().min(0).required(),
    image: Joi.string().optional()
});

const postBudgetSchema = Joi.object().keys({
    budget: Joi.number().min(0).precision(2).required()
})

//Validation Functions
module.exports.validateTrans = function(req) {
    const result = Joi.validate(req.body,postTransSchema);
    return result;
}

module.exports.validateBudget = function(req){
    const result = Joi.validate(req.body,postBudgetSchema);
    return result;
}

module.exports.resultValid = function(result){
    if(result.error === null){
        return true;
    }else{
        return false;
    }
}

module.exports.getFirstDayOfMonth = function() {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth() + 1;
    return `${y}-${m}-1`;
}
