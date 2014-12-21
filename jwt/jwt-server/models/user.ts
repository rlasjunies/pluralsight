import mongoose = require("mongoose");
import bcrypt = require("bcrypt-nodejs");

//user    
export interface IUserDocument extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
    //toJSON(): void;
    comparePasswords(pwd, callback);
}

// used to extend the toJSON function
export interface ISchemaUser extends mongoose.Schema {
    methods: any
}

var userSchema: ISchemaUser =  <ISchemaUser> new mongoose.Schema();
userSchema.add({
    email: String,
    password: String
});

userSchema.pre('save', function (next) {
    var user: IUserDocument = this;

    console.log("user - stringify:" + JSON.stringify(user));

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePasswords = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
}

userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};

//userSchema.post('init', function (doc) {
//    console.log('post-init: %s has been initialized from the db', doc._id);
//})
//userSchema.post('validate', function (doc) {
//    console.log('post-validate: %s has been validated (but not saved yet)', doc._id);
//})
//userSchema.post('save', function (doc) {
//    console.log('post-save: %s has been saved', doc._id);
//})
//userSchema.post('remove', function (doc) {
//    console.log('post-remove: %s has been removed', doc._id);
//})
 
//Export the mongodb model
export function userModel(): mongoose.Model<IUserDocument>  {
    return mongoose.model<IUserDocument>('User', userSchema);
}
