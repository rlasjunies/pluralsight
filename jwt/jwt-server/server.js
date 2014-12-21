var express = require("express");
var bodyparser = require("body-parser");
var libuser = require("./models/user");
var db = require("./db");
//import jwt = require("./services/jwt");
var jwt = require("jwt-simple");
var passport = require("passport");
var passport_local = require("passport-local");
var app = express();
app.use(bodyparser.json());
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
var localStrategy = new passport_local.Strategy({ usernameField: 'email' }, function (username, password, done) {
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
passport.use(localStrategy);
app.get("/", function (req, res) {
    res.redirect("/app");
});
app.post("/api/register", function (req, res) {
    console.log("0" + Date.now());
    var user = req.body;
    console.log("1" + Date.now());
    var userModel = libuser.userModel();
    console.log("2" + Date.now());
    var newUser = new userModel({
        email: user.email,
        password: user.password
    });
    newUser.save(function (err) {
        if (err) {
            throw err;
        }
        createSendToken(newUser, res);
    });
});
var jobs = [
    { name: "IT eng." },
    { name: "Painter" },
    { name: "Assistant" },
    { name: "Boucher" },
    { name: "Driver" }
];
app.get("/api/jobs", function (req, res) {
    if (!req.headers["authorization"]) {
        return res.status(401).send({ message: "you are not authorized!" });
    }
    else {
        var token = req.headers["authorization"].split(" ")[1];
        var payload = jwt.decode(token, "secret");
        if (!payload.sub) {
            return res.status(401).send({ message: 'Authentication failed' });
        }
        else {
            return res.json(jobs);
        }
    }
});
app.post("/api/login", function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err)
            next(err);
        req.login(user, function (err) {
            if (err)
                next(err);
            createSendToken(user, res);
        });
    })(req, res, next);
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
// console.log("Configuring 404 page");
// app.use(function(req, res, next) {
// res.statusCode = 404;
// res.description = "Not found";
// res.render("404");
// });
// console.log("Configuring 500 page");
// app.use(function(err, req, res, next) {
// console.log(err.stack);
// res.statusCode = 500;
// res.description = "Internal server error";
// res.render("500");
// });
new db.db();
//app.use("/", express.static(__dirname + "/../jwt-client/app"));
app.use("/Scripts", express.static(__dirname + "/../jwt-client/Scripts"));
app.use("/app", express.static(__dirname + "/../jwt-client/app"));
app.use("/styles", express.static(__dirname + "/../jwt-client/styles"));
app.use("/fonts", express.static(__dirname + "/../jwt-client/fonts"));
console.log("simple static server listening at http://localhost:3000");
app.listen("3000");
//# sourceMappingURL=server.js.map