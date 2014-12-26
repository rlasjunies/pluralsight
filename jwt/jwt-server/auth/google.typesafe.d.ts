import express = require("express");
export interface IAuthGoogleBody {
    code: string;
    clientId: string;
    redirectUri: string;
}
export interface IAuthGoogleRequest extends express.Request {
    body: IAuthGoogleBody;
}
