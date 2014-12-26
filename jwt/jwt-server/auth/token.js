var libJwt = require("jwt-simple");
function createSendToken(user, res) {
    console.log("createToken-Start:" + Date.now());
    var payload = {
        sub: user.id
    };
    var token = libJwt.encode(payload, "secret");
    res.status(200).send({
        user: user.toJSON(),
        token: token
    });
    console.log("createToken-End:" + Date.now());
}
exports.createSendToken = createSendToken;
//# sourceMappingURL=token.js.map