/**
 * Created by DucTien on 08.11.2016.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// var uniqueValidator = require('../../lib/mongoose-unique-validator')

// DB scheme for user
var userSchema = mongoose.Schema({
    // Email : must be unique (one email can be used for registration only one time)
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },/*
    sex: {
        //true:male, false:female
        type: Boolean,
        required: false
    },*/
    // Name --------
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    // Address ------
    street: {
        type: String,
        required: false
    },
    number: {
        type: Number,
        required: false
    },
    zipCode: {
        type: Number,
        required: false
    },
    town: {
        type: String,
        required: false
    },
    //---------
    telephone: {
        type: String,
        required: false
    },
    trunkSize: {
        type: String,
        required: false
    },
    // Picture - must start with "http://"
    picture: {
        data: String, contentType: String, name: String
    },/*
    birthday: {
        type: Date,
        required: false
    },*/
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }]
});

userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

//The name between quotation mark (User) plus s will be name of collection in database. ( 'User' -> users )
var User = mongoose.model('User', userSchema);
// User.plugin(uniqueValidator);

module.exports = User;