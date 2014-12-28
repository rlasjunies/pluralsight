//import express = require("express");
//import passport = require("passport");
var passport_local = require("passport-local");
//import jwt = require("jwt-simple");
var libuser = require("../models/user");
//import libToken = require("./token");
//export function init(app) {
//    var loginStrategy: passport_local.Strategy = new passport_local.Strategy(strategyOptions, (username, password, done) => {
function login() {
    var strategyOptions = { usernameField: 'email' };
    return new passport_local.Strategy(strategyOptions, function (username, password, done) {
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
                return done(null, dbUser);
            });
        });
    });
}
exports.login = login;
function register() {
    var strategyOptions = { usernameField: 'email' };
    return new passport_local.Strategy(strategyOptions, function (username, password, done) {
        var userModel = libuser.userModel();
        var qryUser = { email: username };
        libuser.userModel().findOne(qryUser, function (err, dbUser) {
            if (err)
                return done(err);
            if (dbUser)
                return done(null, false, { message: "email already exists!" });
            var newUser = new userModel({
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
exports.register = register;
//# sourceMappingURL=auth.js.map