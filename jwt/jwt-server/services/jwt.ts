//import crypto = require("crypto");

//export interface IPayload {
//    sub: string;
//}

//export function encode(payload: IPayload, secret: string): string {
//    var header: any = {
//        typ: 'JWT',
//        alg: 'H256'
//    };

//    var jwt_header: string;
//    jwt_header = encode64Base(JSON.stringify(header));
//    console.log("header encryption:" + jwt_header);

//    var jwt_payload: string;
//    jwt_payload = encode64Base(JSON.stringify(payload));
//    console.log("payload encryption:" + jwt_payload);

//    return jwt_header + "." + jwt_payload + "." + sign(jwt_header + "." + jwt_payload, secret);
//}

//function sign(str, key) :string {
//    return crypto.createHmac('sha256', key).update(str).digest('base64');
//}

//export function decode(token: string, secret: string) : IPayload {
//    var segments = token.split(".");

//    if (segments.length !== 3)
//        throw new Error("Token structure incorrect");

//    var header = JSON.parse(decode64Base(segments[0]));
//    var payload = JSON.parse(decode64Base(segments[1]));
//    var rawsignature = segments[0] + '.' + segments[1];

//    if (!verify(rawsignature, secret, segments[2])) {
//        throw new Error("Verification failed!");
//    }

//    return payload;
//}

//function verify(raw: string, secret: string, signature: string): boolean {
//    return signature === sign(raw, secret);
//}
//function decode64Base(ins: string) : string{
//    return new Buffer(ins, 'base64').toString();
//}

//function encode64Base(ins: string): string {
//    return new Buffer(ins).toString('base64');
//}