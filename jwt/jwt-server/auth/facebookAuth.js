var qs = require('querystring');
var request = require("request");
var libConfig = require("../services/config");
var libUser = require("../models/user");
var libToken = require("./token");
function facebookAuth(req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: libConfig.FACEBOOK_SECRET,
        code: req.body.code
    };
    request.get({
        url: accessTokenUrl,
        qs: params
    }, function (err, response, accessToken) {
        accessToken = qs.parse(accessToken);
        request.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, function (err, response, profile) {
            var users = libUser.userModel();
            users.findOne({ facebookId: profile.id }, function (err, existingUser) {
                if (existingUser)
                    return libToken.createSendToken(existingUser, res);
                var newUser = new users({});
                newUser.facebookId = profile.id;
                newUser.displayName = profile.name;
                newUser.save(function (err, res) {
                    if (err)
                        throw err;
                    libToken.createSendToken(newUser, res);
                });
            });
        });
    });
}
exports.facebookAuth = facebookAuth;
//# sourceMappingURL=facebookAuth.js.map