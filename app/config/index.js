'use strict';

// require the path module
const path = require('path');

// export the configuration
module.exports = {
	// database connection config
	'database': {
		'host': 'mysql.hostinger.ro',
		'database': 'u619707583_inse',
		'username': 'u619707583_root',
		'password': 'cPxD5B8pyY4G'
	},

	// views directory
	'views': path.join(__dirname, '/../views'),

	// server port
	'serverPort': 8080,

	//google oauth credentials
	'googleAuth': {
		'clientID': '16592814341-srr33lj6et1lj5ls0dj4v73q495khfko.apps.googleusercontent.com',
		'clientSecret': 'qjfvCowxJTHbDJ_YjWLeg3dP',
		'callbackURL': 'http://localhost:8080/auth/google/callback'
	}
}