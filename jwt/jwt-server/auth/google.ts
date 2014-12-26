import express = require("express");
import ts = require("./google.typesafe");
import libRequest = require("request");
import libUser = require("../models/user");
import libToken = require("./token");
import mongoose = require("mongoose");


interface IGoogleProfile {
    sub: string; //GoogleID
}

//TODO how to define an interface more precise
//We need to define IGoogleProfile as return of this requestGet

//export interface request {//extends request.RequestAPI{
//    	//function post(options: Options, callback?: (error: any, response: any, body: any) => void): Request;
//		function get(options: request.Options, callback?: (error: any, response: any, body: IGoogleProfile) => void): Request;
//}

export function init(app: express.Application) {
    app.post('/api/authgoogle', (req: express.Request, res: express.Response) => {
        var tsBody = <ts.IAuthGoogleBody>req.body;
        console.log(tsBody.code);

        //var url = ;
        //var params = ;

        var opt: libRequest.Options = {
            url: "https://accounts.google.com/o/oauth2/token",
            json: true,
            form: {
                code: tsBody.code,
                client_id: tsBody.clientId,
                redirect_uri: tsBody.redirectUri,
                grant_type: "authorization_code",
                client_secret: "IOL253SoCTPbmivOXlREdlgV"
            }
        };

        libRequest.post(opt, (err, response, token) => {
            console.log("callback from google, token: " + JSON.stringify(token));

            var accessToken = token.access_token;
            //var headers = {
            //    Authorization: 'Bearer ' + accessToken
            //};

            var headers: libRequest.Headers = {};
            headers["Authorization"] = 'Bearer ' + accessToken;

            var requestParams: libRequest.Options = {};
            requestParams.url = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
            requestParams.headers = headers;
            requestParams.json = true;
            libRequest.get(requestParams, (err, response, profile) => {
                console.log(err + response + JSON.stringify(profile));

                var userModel = libUser.userModel();

                userModel.findOne({
                    googleId: profile.sub
                }, (err, foundUser) => {
                        if (foundUser) return libToken.createSendToken(foundUser, res);

                        //var newUser: mongoose.Model<libUser.IUserDocument> = libUser.userModel();
                        //newUser.googleId = 
                        var userModel = libUser.userModel();

                    var userDoc: libUser.IUserDocument = new userModel({
                        googleID: profile.sub,
                        displayName : profile.name
                    });

                    userDoc.save((err) => {
                        //if (err) return next(err);
                        if (err) throw err;
                        libToken.createSendToken(userDoc, res);
                    });



                    })
            });
        });

        //res.status(200).send({ message: "fine!" });
    });
}

//console.log("require Google loaded!");