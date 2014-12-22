import express = require("express");
import ts = require("./google.typesafe");
var app = express();

//export class AuthGoogle {
//    constructor(app: express.Application) {
//        app.post('/api/auth/google', (req: express.Request, res: express.Response) => {
//            var tsBody = <ts.IAuthGoogleBody>req.body;
//            console.log(tsBody.code);
//        });
//    }
//}

export function init (app:express.Application){
    app.post('/api/authgoogle', (req: express.Request, res: express.Response) => {
        var tsBody = <ts.IAuthGoogleBody>req.body;
        console.log(tsBody.code);
        res.status(200).send("{ok}");
    });
}

//console.log("require Google loaded!");