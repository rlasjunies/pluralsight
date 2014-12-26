export interface IPayload {
    sub: string;
}
export declare function encode(payload: IPayload, secret: string): string;
export declare function decode(token: string, secret: string): IPayload;
