var config = require("./config");
var qs = require('querystring');
var libRequest = require("request");
module.exports = function (req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.FACEBOOK_SECRET,
        code: req.body.code
    };
    libRequest.get({
        url: accessTokenUrl,
        qs: params
    }, function (err, response, accessToken) {
        accessToken = qs.parse(accessToken);
        libRequest.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, function (err, response, profile) {
        });
    });
};
//# sourceMappingURL=facebookAuth.js.map