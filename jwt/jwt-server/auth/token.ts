import jwt = require("jwt-simple");
import moment = require("moment");
import config = require("../services/config");

export function createSendToken(user, res) {
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