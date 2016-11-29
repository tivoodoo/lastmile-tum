/**
 * Created by DucTien on 08.11.2016.
 */

var status = require('http-status');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var Config = require('../../config/config');
var dummyPassword = 'defaultPasswordNothingHasChanged!md7nb1320';

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
      res.status(status.UNAUTHORIZED).send('There exists no user for the specified email address');
      return;
    }

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch || err) {
        res.status(status.UNAUTHORIZED).send('Invalid password');
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
  User
    .findById(req.params.user_id)
    .exec(function (err, user) {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }

      //Hashed password shouldn't be sent to client (To avoid hacker who wants to collect hash table)
      //TRICK: a dummy password value is used to check whether password has changed or not
      //In backend, before updating, the "new" password will be compared with this dummy password value to check whether password has changed or not
      user.password = dummyPassword;
      res.json(user);
    });
};

/*
 * REST API for put {ROOT}/user/put/{{user_id}}
 * user_id is extracted from jwt token so only logged in user can update their own personal data
 * */
module.exports.updateUser = function (req, res) {
  //In getUser, hashed password shouldn't be sent to client (To avoid hacker who wants to collect hash table)
  //TRICK: a dummy password value is used to check whether password has changed or not
  //In backend, before updating, the "new" password will be compared with this dummy password value to check whether password has changed or not
  if (req.body.password != dummyPassword) {
    console.log("Password changed")
    User.findById(req.params.user_id, function (err, user) {
      if (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }
      user.password = req.body.password;
      user.save(function (err) {
        if (err) {
          console.log(err);
          res.status(status.INTERNAL_SERVER_ERROR).send(err);
          return;
        }
      })
    })
  }
  else{
    console.log("Password not changed")
  }

  User.findByIdAndUpdate(
    req.params.user_id,
    {
      //Purposely choose field from request because only some property from the request should be updated
      $set: {
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'sex': req.body.sex,
        'email': req.body.email,
        'birthday': req.body.birthday,
        'street': req.body.street,
        'number': req.body.number,
        'zipCode': req.body.zipCode,
        'town': req.body.town,
        'telephone': req.body.telephone,
/*        'trunkWidth': req.body.trunkWidth,
        'trunkHeight': req.body.trunkHeight,
        'trunkDepth': req.body.trunkDepth,*/
        'picture': req.body.picture,
      }
    },
    {
      //Pass the new object to cb function
      new: true,
      //Run validations
      runValidators: true
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }

      //In getUser, hashed password shouldn't be sent to client (To avoid hacker who wants to collect hash table)
      //TRICK: a dummy password value is used to check whether password has changed or not
      //In backend, before updating, the "new" password will be compared with this dummy password value to check whether password has changed or not
      user.password = dummyPassword;

      res.json(user);
    }
  );
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