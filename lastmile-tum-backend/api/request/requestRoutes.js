/**
 * Created by DucTien on 08.11.2016.
 */


module.exports = requestRoutes;

function requestRoutes(passport) {
  var requestController = require('./requestController');

  var router = require('express').Router();
  var unless = require('express-unless');

  var mw = passport.authenticate('jwt', {session: false});
  mw.unless = unless;

  //middleware
  router.use(mw.unless({method: ['GET', 'OPTIONS']}));

  /*
   * REST API
   *
   * */
    router.route('/')
        .post(requestController.postRequest)
        .get(requestController.getRequests);

    router.route('/:request_id')
        .get(requestController.getRequest)
        .put(requestController.updateRequest)
        .delete(requestController.deleteRequest);


  return router;


}
