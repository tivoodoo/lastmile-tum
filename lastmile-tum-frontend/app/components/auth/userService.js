/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular.module('lastMile')
    .service('userService', userService)
    .factory('User', function ($resource, BACKEND_BASE_URL) {
      //API von Angular : https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(BACKEND_BASE_URL + '/user/put/:userID', {userID: '@_id'}, {
        //Define new function update
        update: {
          method: 'PUT'
        }
      });

    });

  function userService(BACKEND_BASE_URL, $http, auth, User) {

    this.register = register;


    ////////////////

    function register(user) {
      return $http.post(BACKEND_BASE_URL + '/user/signup', user);
    }

  }

})();
