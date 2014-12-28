import qs = require('querystring');
import request = require("request");
import express = require("express");

import libConfig = require("../services/config");
import libUser = require("../models/user");
import libToken = require("./token");

interface IFacebookProfile{
    id: string;
    name: string;
}

export function facebookAuth (req: express.Request, res:express.Response){

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
        }, (err, response, accessToken) => {
        accessToken = qs.parse(accessToken);

        request.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, (err, response, profile: IFacebookProfile) => {
                var users = libUser.userModel();

                users.findOne({ facebookId: profile.id }, (err, existingUser) => {
                    if (existingUser) return libToken.createSendToken(existingUser, res);
                    var newUser: libUser.IUserDocument = new users({});

                    newUser.facebookId = profile.id;
                    newUser.displayName = profile.name;

                    newUser.save<libUser.IUserDocument>((err, res) => {
                        if (err) throw err;

                        libToken.createSendToken(newUser, res);
                    })
                });
        });
    });
}
