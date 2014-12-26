import mongoose = require("mongoose");
export interface IUserDocument extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
    googleId: string;
    comparePasswords(pwd: any, callback: any): any;
}
export interface IUserModel extends mongoose.Model<IUserDocument> {
    googleID: string;
    displayName: string;
}
export interface ISchemaUser extends mongoose.Schema {
    methods: any;
}
export declare function userModel(): IUserModel;
