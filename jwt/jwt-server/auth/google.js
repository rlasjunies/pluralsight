var express = require("express");
var app = express();
//export class AuthGoogle {
//    constructor(app: express.Application) {
//        app.post('/api/auth/google', (req: express.Request, res: express.Response) => {
//            var tsBody = <ts.IAuthGoogleBody>req.body;
//            console.log(tsBody.code);
//        });
//    }
//}
function init(app) {
    app.post('/api/authgoogle', function (req, res) {
        var tsBody = req.body;
        console.log(tsBody.code);
        res.status(200).send("{ok}");
    });
}
exports.init = init;
//# sourceMappingURL=google.js.map