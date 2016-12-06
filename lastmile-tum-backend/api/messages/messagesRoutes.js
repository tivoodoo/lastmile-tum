/**
 * Created by DucTien on 20.11.2016.
 */

module.exports = messageRoutes;

function messageRoutes(passport) {
  var messageController = require('./messagesController')

  var router = require('express').Router();

  var unless = require('express-unless');

  var auth = passport.authenticate('jwt', {session: false});
  auth.unless = unless;

  /*
   * First layer of authorization: Only logged in user can go through.
   * */
  router.use(auth.unless({method: ['GET', 'OPTIONS']}));

  /*
   * REST API for POST {ROOT}/message/post
   *
   * */
  router.post('/post', messageController.postMessage);

  /*
   * REST API for GET {ROOT}/message/threads/request/{request_id}
   *
   * Get all message threads from a request
   * This api will return all user that contacted the requester
   *
   * @params request_id
   *
   * */
  router.get('/threads/request/:request_id', messageController.getThreadsFromRequest);

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
  router.get('/thread/content/', messageController.getMessagesFromThread);

  /*
   * REST API for DELETE {ROOT}/message/thread/
   *
   * Delete all messages of a thread
   *
   * @params request_id
   * @params supplier_id
   *
   * */
  router.delete('/delete/thread/', messageController.deleteThread);

  return router;

}
