/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular
    .module('lastMile')
    .controller('RegisterCtrl', function ($rootScope, $scope, userService, $location, $mdToast) {

      //Forward directly to dashboard if the user is already logged in
      if ($rootScope.loggedIn) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('You are currently logged in')
            .position('bottom right')
            .hideDelay(3000)
        );
        $location.path('/');
      }

      /* jshint validthis: true */
      var user = this;

      user.register = register;
      user.clearInput = clearInput;

      function register() {
        userService.register(user).then(function () {
          alert("Registration done");
          //TODO: Here rerouting instead of alert
        }, function (response) {
          if (response.status == 400 || response.status == 401) {
            alert("An unknown error occured. Please try again later.");
          }
        });
      }

      function clearInput() {
        user.firstName = '';
        user.lastName = '';
        user.email = '';
        user.password = '';
      };

    });
})();


