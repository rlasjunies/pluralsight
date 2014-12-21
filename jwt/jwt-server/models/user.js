var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var userSchema = new mongoose.Schema();
userSchema.add({
    email: String,
    password: String
});
userSchema.pre('save', function (next) {
    var user = this;
    console.log("user - stringify:" + JSON.stringify(user));
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePasswords = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
};
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
function userModel() {
    return mongoose.model('User', userSchema);
}
exports.userModel = userModel;
//# sourceMappingURL=user.js.map