/**
 * Created by DucTien on 20.11.2016.
 */

var status = require('http-status');
var Message = require('./messagesSchema');
var User = require('../user/userSchema');
var auth = require('../../authorization/auth');

/*
 * REST API for POST {ROOT}/message/post
 *
 * */
module.exports.postMessage = function (req, res) {

  var userId = auth.getUserIdFromRequestToken(req);

  if (userId != req.body.sender) {
    res.sendStatus(status.UNAUTHORIZED);
    return;
  }

  var message = new Message(req.body);

  message.save(function (err) {

    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).send(err);
      return;
    }

    res.sendStatus(status.CREATED);
    return;

  });
}

/*
 * REST API for GET {ROOT}/message/threads/request/{request_id}
 *
 * Get all message threads from a request
 * This api will return all user that contacted the requester
 *
 * @params request_id
 *
 * */
module.exports.getThreadsFromRequest = function (req, res) {
  Message
    .find({'request': req.params.request_id})
    .distinct('sender')
    .exec(function (err, lIDoS) {

      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send(err);
        return;
      }

      //Exclude origin of the API request in the list
      var userID = auth.getUserIdFromRequestToken(req);
      var index = lIDoS.indexOf(userID);
      lIDoS.splice(index);

      //Populate user
      User
        .find({'_id': {$in: lIDoS}})
        .exec(function (error, user) {

          if (error) {
            res.status(status.INTERNAL_SERVER_ERROR).send(error);
            return;
          }

          res.json(user);
          return;

        })
    })
}

/*
 * REST API for GET {ROOT}/message/thread/content/
 *
 * Get all messages of a thread.
 * A thread is defined as a combination of request and supplier
 *
 * @params request_id
 * @params supplier_id
 *
 * */
module.exports.getMessagesFromThread = function (req, res) {
  var request_id = req.query.request_id;
  var supplier_id = req.query.supplier_id;
  var user_id = auth.getUserIdFromRequestToken(req);

  Message
    .find(
      {
        'request': request_id,
        'sender': {$in: [supplier_id,user_id]}
      }
      , 'date message sender')
    .exec(function (error, message) {

      if (error) {
        res.status(status.INTERNAL_SERVER_ERROR).send(error);
        return;
      }

      res.json(message);
      return;

    })
}
/*
 * REST API for DELETE {ROOT}/message/thread/
 *
 * Delete all messages of a thread
 *
 * @params request_id
 * @params supplier_id
 *
 * */
module.exports.deleteThread = function (req, res) {

}
