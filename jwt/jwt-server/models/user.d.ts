import mongoose = require("mongoose");
export interface IUserDocument extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
    active: boolean;
    googleId: string;
    facebookId: string;
    displayName: string;
    comparePasswords(pwd: any, callback: any): any;
}
export interface IUserModel extends mongoose.Model<IUserDocument> {
    googleID: string;
    displayName: string;
    facebookId: string;
}
export interface ISchemaUser extends mongoose.Schema {
    methods: any;
}
export declare function userModel(): IUserModel;
