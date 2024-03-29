/**
 * Created by DucTien on 08.11.2016.
 */


module.exports = requestRoutes;

function requestRoutes(passport) {
  var requestController = require('./requestController');
  var commentController = require('./commentController');
  var haggleController = require('./haggleController');

  var router = require('express').Router();
  var unless = require('express-unless');
  var multiparty = require('connect-multiparty');
  var multipartyMiddleware = multiparty();

  var mw = passport.authenticate('jwt', {session: false});
  mw.unless = unless;

  //middleware
  router.use(mw.unless({method: ['GET', 'OPTIONS']}));

  /*
   * REST API
   *
   * */
  router.route('/')
    .post(multipartyMiddleware, requestController.postRequest)
    .get(requestController.getRequests);

  router.route('/:request_id')
    .get(requestController.getRequest)
    .put(multipartyMiddleware, requestController.updateRequest)
    .delete(requestController.deleteRequest);

    router.route('/acceptOffer/:request_id')
        .post(requestController.postNewAcceptOffer);

    router.route('/acceptOffer/accept/:request_id')
        .post(requestController.acceptAcceptOffer);

    router.route('/acceptOffer/decline/:request_id')
        .post(requestController.declineAcceptOffer);

  router.route('/comment/:request_id')
    .get(commentController.getMessages)
    .post(commentController.putMessage);
  
  router.route('/haggle/:request_id')
    .get(haggleController.getNewOffer)
    .post(haggleController.postNewOffer);

  router.route('/haggle/accept/:request_id')
    .post(haggleController.acceptOffer);

  router.route('/haggle/decline/:request_id')
    .post(haggleController.declineOffer);
  
  return router;


}
