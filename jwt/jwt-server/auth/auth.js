var passport = require("passport");
var passport_local = require("passport-local");
var jwt = require("jwt-simple");
var libuser = require("../models/user");
function init(app) {
    var strategyOptions = { usernameField: 'email' };
    var loginStrategy = new passport_local.Strategy(strategyOptions, function (username, password, done) {
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
    var registerStrategy = new passport_local.Strategy(strategyOptions, function (username, password, done) {
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
    passport.use('local-register', registerStrategy);
    app.post("/api/register", passport.authenticate('local-register'), function (req, res) {
        createSendToken(req.user, res);
    });
    app.post("/api/login", passport.authenticate('local-login'), function (req, res) {
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
}
exports.init = init;
;
//# sourceMappingURL=auth.js.map