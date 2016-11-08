/**
 * Created by DucTien on 08.11.2016.
 */

var status = require('http-status');

/*
 * REST API for POST {ROOT}/login
 * @Params username, password
 *
 * */
module.exports.login = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};

/*
 * REST API for POST {ROOT}/signup
 *
 * */
module.exports.signup = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};

/*
 * REST API for POST {ROOT}/unregister
 * user_id is extracted from jwt token
 *
 * */
module.exports.unregister = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};

/*
 * REST API for GET {ROOT}/user/{{user_id}}
 * user_id is extracted from jwt token so only logged in user can request their own personal data
 * */
module.exports.getUser = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};

/*
 * REST API for put {ROOT}/user/{{user_id}}
 * user_id is extracted from jwt token so only logged in user can update their own personal data
 * */
module.exports.updateUser = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};
