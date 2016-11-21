/**
 * Created by DucTien on 08.11.2016.
 */

var status = require('http-status');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var Config = require('../../config/config');

/*
 * REST API for POST {ROOT}/user/login
 * @Params username, password
 *
 * */
module.exports.login = function (req, res) {
  console.log(req.body.password);
  if (!req.body.email) {
    res.status(status.BAD_REQUEST).send('Email required');
    return;
  }

  if (!req.body.password) {
    res.status(status.BAD_REQUEST).send('Password required');
    return;
  }

  User.findOne({'email': req.body.email}, function (err, user) {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).send(err);
      return
    }

    if (!user) {
      res.status(status.UNAUTHORIZED).send('Invalid Credentials');
      return;
    }

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch || err) {
        res.status(status.UNAUTHORIZED).send('Invalid Credentials');
      } else {
        res.status(status.OK).json({token: createToken(user)});
      }
    });
  });
};

/*
 * REST API for POST {ROOT}/user/signup
 *
 * */
module.exports.signup = function (req, res) {

  if (!req.body.email) {
    res.status(status.BAD_REQUEST).send('Email required');
    return;
  }

  if (!req.body.password) {
    res.status(status.BAD_REQUEST).send('Password required');
    return;
  }

  var user = new User(req.body);

  console.log(user);

  user.save(function (err) {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).send(err);
      return;
    }

    res.status(status.CREATED).json({token: createToken(user)});
  });
};

/*
 * REST API for POST {ROOT}/user/unregister
 * user_id is extracted from jwt token
 *
 * */
module.exports.unregister = function (req, res) {
  req.user.remove()
    .then(function (user) {
      res.sendStatus(status.OK);
    }, function (err) {
      res.status(status.INTERNAL_SERVER_ERROR).send(err);
    });
};

/*
 * REST API for GET {ROOT}/user/get/{{user_id}}
 * user_id is extracted from jwt token so only logged in user can request their own personal data
 * */
module.exports.getUser = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};

/*
 * REST API for put {ROOT}/user/put/{{user_id}}
 * user_id is extracted from jwt token so only logged in user can update their own personal data
 * */
module.exports.updateUser = function (req, res) {
  res.status(status.OK).send('Login');
  return;
};


/**
 * Creates a user authentication token.
 *
 * @param user The user object
 * @returns jwt token
 */
function createToken(user) {
  //This will be included in payload of jwt token
  var tokenPayload = {
    user: {
      _id: user._id,
      email: user.email
    }
  };

  return jwt.encode(tokenPayload, Config.auth.jwtSecret);
}