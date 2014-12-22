import express = require("express");
import passport = require("passport");
import passport_local = require("passport-local");
import jwt = require("jwt-simple");
import libuser = require("../models/user");

export function init(app) {

    var strategyOptions = { usernameField: 'email' };
    var loginStrategy: passport_local.Strategy = new passport_local.Strategy(strategyOptions, (username, password, done) => {
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
    passport.use('local-login', loginStrategy);

    var registerStrategy: passport_local.Strategy = new passport_local.Strategy(strategyOptions, (username, password, done) => {
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
    passport.use('local-register', registerStrategy);

    app.post("/api/register", passport.authenticate('local-register'), (req: express.Request, res: express.Response) => {
        createSendToken(req.user, res);
    });

    app.post("/api/login", passport.authenticate('local-login'), function (req: express.Request, res: express.Response) {
        createSendToken(req.user, res);
    });

    function createSendToken(user, res) {
        console.log("createToken-Start:" + Date.now());

        var payload = {
            sub: user.id
        };

        var token = jwt.encode(payload, "secret");

        res.status(200).send({
            user: user.toJSON(),
            token: token
        });
        console.log("createToken-End:" + Date.now());

    }
};