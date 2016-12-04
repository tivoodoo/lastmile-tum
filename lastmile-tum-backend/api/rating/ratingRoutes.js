/**
 * Created by DucTien on 20.11.2016.
 */

module.exports = ratingRoutes;

function ratingRoutes(passport) {

  var ratingController = require('./ratingController')

  var router = require('express').Router();

  var unless = require('express-unless');

  var auth = passport.authenticate('jwt', {session: false});
  auth.unless = unless;

  /*
   * First layer of authorization: Only logged in user can go through.
   * */
  router.use(auth.unless({method: ['GET', 'OPTIONS']}));

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
   * REST API for GET {ROOT}/rating/user/{{request_id}}
   * Return all rating from an user
   *
   * */
  router.get('/user/:user_id', ratingController.getRatingFromUser);


  /*
   * REST API for PUT {ROOT}/rating/{{request_id}}
   * */
  router.put('/:rating_id', ratingController.updateRating);

  /*
   * REST API for DELETE {ROOT}/rating/{{rating_id}}
   * */
  //Route deprecated because it's not necessary
  // router.delete('/delete/:rating_id', requestController.deleteRating);

  return router;

}
