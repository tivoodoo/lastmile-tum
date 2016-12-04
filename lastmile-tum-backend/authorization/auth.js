/**
 * Created by DucTien on 03.12.2016.
 */

var jwt = require('jwt-simple');
var Config = require('../config/config.js');
var User = require('../api/user/userSchema');

module.exports.getUserIdFromRequestToken = getUserIdFromRequestToken;

function getUserIdFromRequestToken(req) {
  var authorizationStr = req.headers.authorization;
  var token = authorizationStr.substr(authorizationStr.indexOf(' ') + 1);
  var decoded = jwt.decode(token, Config.auth.jwtSecret);
  return decoded.user._id;
}
