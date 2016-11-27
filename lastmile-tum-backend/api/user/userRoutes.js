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
  router.post('/unregister',passport.authenticate('jwt', {session: false}), userController.unregister);

  /*
   * REST API for GET {ROOT}/user/get/{{user_id}}
   * user_id is extracted from jwt token so only logged in user can request their own personal data
   * */
  router.get('/get/:user_id',passport.authenticate('jwt', {session: false}), userController.getUser);

  /*
   * REST API for put {ROOT}/user/put/{{user_id}}
   * user_id is extracted from jwt token so only logged in user can update their own personal data
   * */
  router.put('/put/:user_id',passport.authenticate('jwt', {session: false}), userController.updateUser);

  return router;

}