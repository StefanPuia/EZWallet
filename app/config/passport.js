'use strict';

// load configuration file
const config = require('./index');

// load utility functions
const util = require('./../core/utility');

// load authentication module
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// use the google authentication strategy
passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        util.findOrCreate(profile._json, function(err, user) {
            return done(err, user);
        });
    }
));

// passport user serialize
passport.serializeUser(function(user, done) {
	done(null, user);
});

// passport user deserialize
passport.deserializeUser(function(user, done) {
	done(null, user);
});

// export the passport object
module.exports = passport;