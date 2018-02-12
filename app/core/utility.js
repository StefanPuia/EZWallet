'use strict';

// import the config file
const config = require('./../config');

// require the sha256 module
const sha256 = require('sha256');

// intialise the mysql module
const mysql = require('mysql');
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
        console.log('Database server closed connection. Reconnecting...');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect(); 
        } else { 
            throw err; 
        }
    });
}

handleDisconnect();

module.exports.query = function(query, values, callback) {
    mysqlConnection.query(query, values, function(error, results, fields) {
        if (error) throw error;
        callback(results);
    })
}


// placeholder function
module.exports.findOrCreate = function(profile, callback) {
    const token = sha256("google" + profile.id);
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = ['user', 'token', token];
    sql = mysql.format(sql, inserts);

    mysqlConnection.query(sql, function(error, results, fields) {
        if (error) {
            callback(error);
            throw error;
        } else if (!results[0]) {
            console.log('not found, inserting');
            mysqlConnection.query('INSERT INTO user SET ?', {
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                email: profile.emails[0].value,
                token: token,
                budget: 0
            })
            callback(null, false)
        } else {
            callback(null, results[0]);
            console.log(results[0]);
        }
    })
}