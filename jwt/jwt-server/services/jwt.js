var crypto = require("crypto");
function encode(payload, secret) {
    var header = {
        typ: 'JWT',
        alg: 'H256'
    };
    var jwt_header;
    jwt_header = encode64Base(JSON.stringify(header));
    console.log("header encryption:" + jwt_header);
    var jwt_payload;
    jwt_payload = encode64Base(JSON.stringify(payload));
    console.log("payload encryption:" + jwt_payload);
    return jwt_header + "." + jwt_payload + "." + sign(jwt_header + "." + jwt_payload, secret);
}
exports.encode = encode;
function sign(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
}
function decode(token, secret) {
    var segments = token.split(".");
    if (segments.length !== 3)
        throw new Error("Token structure incorrect");
    var header = JSON.parse(decode64Base(segments[0]));
    var payload = JSON.parse(decode64Base(segments[1]));
    var rawsignature = segments[0] + '.' + segments[1];
    if (!verify(rawsignature, secret, segments[2])) {
        throw new Error("Verification failed!");
    }
    return payload;
}
exports.decode = decode;
function verify(raw, secret, signature) {
    return signature === sign(raw, secret);
}
function decode64Base(ins) {
    return new Buffer(ins, 'base64').toString();
}
function encode64Base(ins) {
    return new Buffer(ins).toString('base64');
}
//# sourceMappingURL=jwt.js.map