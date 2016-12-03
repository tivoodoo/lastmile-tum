/**
 * Created by DucTien on 20.11.2016.
 */

module.exports = ratingRoutes;

function ratingRoutes() {

  var messageController = require('./ratingController')

  var router = require('express').Router();

  var unless = require('express-unless');

  var auth = passport.authenticate('jwt', {session: false});
  auth.unless = unless;

  /*
   * First layer of authorization: Only logged in user can go through.
   * */
  router.use(mw.unless({method: ['GET', 'OPTIONS']}));

  /*
   * REST API for POST {ROOT}/rating/post
   *
   * */
  router.post('/post', ratingController.postRating);

  /*
   * REST API for GET {ROOT}/rating/{{rating_id}}
   *
   * */
  router.get('/:rating_id', ratingController.getRating);

  /*
   * REST API for GET {ROOT}/rating/request/{{request_id}}
   * Return all rating from a request
   *
   * */
  router.get('/request/:request_id', ratingController.getRatingFromRequest);

  /*
   * REST API for PUT {ROOT}/rating/{{request_id}}
   * */
  router.put('/:rating_id', ratingController.updateRating);

  /*
   * REST API for DELETE {ROOT}/rating/{{rating_id}}
   * */
  router.delete('/delete/:rating_id', requestController.deleteRating);

  return router;

}
