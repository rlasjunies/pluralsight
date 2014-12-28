var libRequest = require("request");
var libUser = require("../models/user");
var libToken = require("./token");
var libConfig = require("../services/config");
//TODO how to define an interface more precise
//We need to define IGoogleProfile as return of this requestGet
//export interface request {//extends request.RequestAPI{
//    	//function post(options: Options, callback?: (error: any, response: any, body: any) => void): Request;
//		function get(options: request.Options, callback?: (error: any, response: any, body: IGoogleProfile) => void): Request;
//}
function googleAuth(req, res) {
    var tsBody = req.body;
    console.log(tsBody.code);
    //var url = ;
    //var params = ;
    var opt = {
        url: "https://accounts.google.com/o/oauth2/token",
        json: true,
        form: {
            code: tsBody.code,
            client_id: tsBody.clientId,
            redirect_uri: tsBody.redirectUri,
            grant_type: "authorization_code",
            client_secret: libConfig.GOOGLE_SECRET
        }
    };
    libRequest.post(opt, function (err, response, token) {
        console.log("\ngoogleAuth - token: " + JSON.stringify(token));
        if (err)
            throw err;
        var accessToken = token.access_token;
        //var headers = {
        //    Authorization: 'Bearer ' + accessToken
        //};
        var headers = {};
        headers["Authorization"] = 'Bearer ' + accessToken;
        var requestParams = {};
        requestParams.url = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
        requestParams.headers = headers;
        requestParams.json = true;
        libRequest.get(requestParams, function (err, response, profile) {
            console.log("\ngoogleAuth:" + err + response + JSON.stringify(profile));
            if (err)
                throw err;
            var userModel = libUser.userModel();
            userModel.findOne({
                googleId: profile.sub
            }, function (err, foundUser) {
                if (foundUser)
                    return libToken.createSendToken(foundUser, res);
                var userModel = libUser.userModel();
                var userDoc = new userModel({});
                userDoc.id = profile.sub;
                userDoc.displayName = profile.name;
                userDoc.save(function (err) {
                    //if (err) return next(err);
                    if (err)
                        throw err;
                    libToken.createSendToken(userDoc, res);
                });
            });
        });
    });
    //res.status(200).send({ message: "fine!" });
}
exports.googleAuth = googleAuth;
//# sourceMappingURL=googleAuth.js.map