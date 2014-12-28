﻿import express = require("express");
import _ = require("underscore");
import jwt = require("jwt-simple");
import fs = require("fs");
import nodemailer = require("nodemailer");

import xConfig = require("../services/config");
import xUser = require("../models/user");

//import smtpTransport = require('nodemailer-smtp-transport');

interface IModel {
    verifyUrl: string;
    title: string;
    subTitle: string;
    body: string;
}

interface IPayload {
    sub:string
}

export function send(email, res) {
    var payload : IPayload = {
        sub: email
    };

    var token = jwt.encode(payload, xConfig.EMAIL_SECRET);
    
    var NSMTPTransportOptions: NodemailerSMTPTransportOptions = {
        service: 'Gmail',
        auth: {
            user: 'rlasjunies@gmail.com',
            pass: xConfig.SMTP_PASS
        }
    }
    var transporter = nodemailer.createTransport(NSMTPTransportOptions);

    var mailOptions: MailComposer = {
        from: 'Richard Lasjunies<rlasjunies@gmail.com',
        to: email,
        subject: 'PS Jwt Account verification',
        html: getHtml(token)
    };

    transporter.sendMail(mailOptions, (err:Error) => {
        if (err) return res.status(500, err);

        console.log("Verification email sent to:" + mailOptions.to);
    });
}

export function verify(req:express.Request, res:express.Response, next) {
    var token = req.query.token;

    var payload : IPayload = jwt.decode(token, xConfig.EMAIL_SECRET);

    var email = payload.sub;

    if (!email) return handleError(res);

    var users = xUser.userModel();
    users.findOne({ email: email }, (err, userFound: xUser.IUserDocument) => {
        if (err) return res.status(500);

        if (!userFound) return handleError(res);

        if (!userFound.active) userFound.active = true;

        userFound.save((err, userFound: xUser.IUserDocument): any => {
            if (err) return res.status(500);

            return res.redirect(xConfig.APP_URL);
        });

    });

}

function handleError(res:express.Response) {
    return res.status(401).send({
        message:"Authenitication failed,enable to verify the email"
    });
}

function getHtml(token: string) {

    var model: IModel = {
        verifyUrl: 'http://localhost:3000/auth/verifyemail?token=' + token,
        title: 'psJwt',
        subTitle: "Thanks for signing up!",
        body: "Please, verify your email address by clicking the button below."
    }

    var path = './views/emailVerification.html';

    //TODO replace readFileSync by Async
    var html = fs.readFileSync(path, { encoding: 'utf8' });

    var template = _.template(html);

    var sReturn = template(model) 

    return sReturn;
}

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};