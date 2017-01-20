/**
 * Created by DucTien on 08.11.2016.
 */

/**
 * BACKEND router for user.
 */

module.exports = userRoutes;

function userRoutes(passport) {

  var userController = require('./userController');
  var router = require('express').Router();
    var multiparty = require('connect-multiparty');
    var multipartyMiddleware = multiparty();

  /*
   * REST API for POST {ROOT}/user/login
   * @Params username, password
   *
   * */
  router.post('/login', userController.login);

  /*
   * REST API for POST {ROOT}/user/signup
   *
   * */
  router.post('/signup', userController.signup);

  /*
   * REST API for POST {ROOT}/user/unregister
   * user_id is extracted from jwt token
   *
   * */
  router.post('/unregister', passport.authenticate('jwt', {session: false}), userController.unregister);

  /*
   * REST API for GET and PUT {ROOT}/user/{{user_id}}
   * user_id is extracted from jwt token so only logged in user can request their own personal data
   * */
  router.route('/:user_id')
      .get(passport.authenticate('jwt', {session: false}), userController.getUser)
      .put(multipartyMiddleware, passport.authenticate('jwt', {session: false}), userController.updateUser);

  /*
   * REST API for GET {ROOT}/user/rating
   * Return all rating of user
   *
   * */
  //Is one API of Rating
  // router.get('/rating', userController.getRating);

  return router;

}