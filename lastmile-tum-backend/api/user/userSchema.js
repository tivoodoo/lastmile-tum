/**
 * Created by DucTien on 08.11.2016.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// DB scheme for user
var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sex: {
    //true:male, false:female
    type: Boolean,
    required: true
  },
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
    type: Number,
    required: false
  },
  //---------
  telephone: {
    type: String,
    required:false
  },
  // Trunk details---------
  trunkWidth:{
    type: Number,
    required: false
  },
  trunkHeight:{
    type: Number,
    required: false
  },
  trunkDepth:{
    type: Number,
    required: false
  },
  // Picture - must start with "http://"
  picture: {
    type: String,
    required: false,
    match: /http:\/\//i
  },
  birthday: {
    type: Date,
    required: true
  }
});

//The name between quotation mark (User) plus s will be name of collection in database. ( 'User' -> users )
var User = mongoose.model('User', userSchema);

module.exports = User;