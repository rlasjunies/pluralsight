var passport = require("passport");
var jwt = require("jwt-simple");
function init(app) {
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
//# sourceMappingURL=register.js.map