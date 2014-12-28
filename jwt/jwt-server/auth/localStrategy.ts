﻿import passport_local = require("passport-local");
import libuser = require("../models/user");

var strategyOptions = { usernameField: 'email' };
export function login() {
    return new passport_local.Strategy(strategyOptions, (username, password, done) => {
        var qryUser = { email: username };
        libuser.userModel().findOne(qryUser, function (err, dbUser) {
            if (err)
                return done(err);

            if (!dbUser)
                return done(null, false, { message: "Wrong email / password" });

            dbUser.comparePasswords(password, function (err, isMatching) {
                if (err)
                    return done(err);

                if (!isMatching)
                    return done(null, false, { message: "Wrong email / password" });

                console.log("User: %s logged in", dbUser.email);
                return done(null, dbUser);
            });
        });
    });
}


export function register() {
    return new passport_local.Strategy(strategyOptions, (username, password, done) => {
        var userModel = libuser.userModel();
        var qryUser = { email: username };

        libuser.userModel().findOne(qryUser, (err, dbUser) => {
            if (err)
                return done(err);

            if (dbUser)
                return done(null, false, { message: "email already exists!" });

            var newUser: libuser.IUserDocument = new userModel({
                email: username,
                password: password
            });

            newUser.save(function (err) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });

        });
    });
}