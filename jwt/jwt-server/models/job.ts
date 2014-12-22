import jwt = require("jwt-simple");
import express = require("express");

export function init(app:express.Application) {
    var jobs: any[] = [{ name: "IT eng." },
        { name: "Painter" }, { name: "Assistant" }, { name: "Boucher" }, { name: "Driver" }];

    app.get("/api/jobs", function (req: express.Request, res: express.Response) {
        if (!req.headers["authorization"]) {
            return res.status(401).send({ message: "you are not authorized!" });
        } else {

            var token = req.headers["authorization"].split(" ")[1];
            var payload = jwt.decode(token, "secret");

            if (!payload.sub) {
                return res.status(401).send({ message: 'Authentication failed' });
            } else {
                return res.json(jobs);
            }
        }

    });

};