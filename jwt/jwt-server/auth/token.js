var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("../services/config");
function createSendToken(user, res) {
    var payload = {
        sub: user.id,
        exp: moment().add(10, 'seconds').unix()
    };
    var token = jwt.encode(payload, config.JWT_SECRET);
    res.status(200).send({
        user: user.toJSON(),
        token: token
    });
}
exports.createSendToken = createSendToken;
//# sourceMappingURL=token.js.map