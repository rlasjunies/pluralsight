var express = require("express");
var bodyparser = require("body-parser");
var db = require("./db");
var passport = require("passport");
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
var authLib = require("./auth/auth");
var auth = authLib.init(app);
//import authGoogle = require("./auth/google");
//var authG = new authGoogle.init(app);
app.post('/api/authgoogle', function (req, res) {
    var tsBody = req.body;
    console.log(tsBody.code);
    res.status(200).send("{ok}");
});
var jobsLib = require("./models/job");
var jobs = new jobsLib.init(app);
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
app.use("/", express.static(__dirname + "/../jwt-client/app"));
app.use("/Scripts", express.static(__dirname + "/../jwt-client/Scripts"));
app.use("/app", express.static(__dirname + "/../jwt-client/app"));
app.use("/styles", express.static(__dirname + "/../jwt-client/styles"));
app.use("/fonts", express.static(__dirname + "/../jwt-client/fonts"));
console.log("simple static server listening at http://localhost:3000");
app.listen("3000");
//# sourceMappingURL=server.js.map