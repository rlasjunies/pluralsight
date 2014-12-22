var jwt = require("jwt-simple");
function init(app) {
    var jobs = [{ name: "IT eng." }, { name: "Painter" }, { name: "Assistant" }, { name: "Boucher" }, { name: "Driver" }];
    app.get("/api/jobs", function (req, res) {
        if (!req.headers["authorization"]) {
            return res.status(401).send({ message: "you are not authorized!" });
        }
        else {
            var token = req.headers["authorization"].split(" ")[1];
            var payload = jwt.decode(token, "secret");
            if (!payload.sub) {
                return res.status(401).send({ message: 'Authentication failed' });
            }
            else {
                return res.json(jobs);
            }
        }
    });
}
exports.init = init;
;
//# sourceMappingURL=job.js.map