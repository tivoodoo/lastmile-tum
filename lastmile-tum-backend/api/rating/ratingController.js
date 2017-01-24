/**
 * Created by DucTien on 20.11.2016.
 */

var status = require('http-status');
var Rating = require('./ratingSchema');
var User = require('../user/userSchema');
var Request = require('../request/requestSchema');
var auth = require('../../authorization/auth');


/*
 * REST API for POST {ROOT}/rating/post
 *
 * */
module.exports.postRating = function (req, res) {
  var userId = auth.getUserIdFromRequestToken(req);
  console.log(req);
  Request.findById(req.body.request, function (err, request) {
    if (err) {
      console.log(err);
      res.status(401).send(err);
    }

    var rating = new Rating(req.body);
    var ratedUserID = request.requester;

    rating.save(function (err) {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }

      User
        .findByIdAndUpdate(
          ratedUserID,
          {$push: {'ratings': rating}},
          {new: true},
          function (err, user) {
            if (err) {
              console.log(err);
              res.status(status.INTERNAL_SERVER_ERROR).send(err);
              return;
            }
            user.populate('ratings', function () {
              // populate user with ratings value and response
              res.json(user);
            });
          }
        )
    });
  });

}

/*
 * REST API for GET {ROOT}/rating/{{rating_id}}
 *
 * */
module.exports.getRating = function (req, res) {
  Rating
    .findById(req.params.rating_id, function (err, rating) {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }
      res.json(rating);
    });
}

/*
 * REST API for GET {ROOT}/rating/request/{{request_id}}
 * Return all rating from a request
 *
 * */

module.exports.getRatingFromRequest = function (req, res) {
  Rating
    .find({'request': req.params.request_id}, function (err, rating) {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }
      res.json(rating);
    })
}

/*
 * REST API for GET {ROOT}/rating/user/{{user_id}}
 * Return all rating from an user
 *
 * */

module.exports.getRatingFromUser = function (req, res) {
  User
    .findById(req.params.user_id, 'ratings')
    .populate('ratings')
    .exec(function (err, user) {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }
      res.json(user);
    })
}


/*
 * REST API for PUT {ROOT}/rating/{{rating_id}}
 * */
module.exports.updateRating = function (req, res) {

  Rating.findByIdAndUpdate(
    req.params.rating_id,
    req.body,
    {
      //Pass the new object to cb function
      new: true,
      //Run validations
      runValidators: true
    },
    function (err, rating) {
      if (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }

      res.json(rating);
    }
  );
}

/*
 * REST API for DELETE {ROOT}/rating/{{rating_id}}
 * */
module.exports.deleteRating = function (req, res) {

}
