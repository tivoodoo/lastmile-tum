/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
    'use strict';

    angular
        .module('lastMile')
        .controller('RegisterCtrl', function ($rootScope, $scope, userService, $location, $mdToast) {

            $('#showRegistration').submit(function(e) {
                $('#showRegistration').modal('hide');
            });
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

            // jshint validthis: true
            var reg = this;

            reg.register = register;
            reg.clearInput = clearInput;

            function register() {
                userService.register(reg).then(function () {
                    alert("Registration done");
                    //TODO: Here rerouting instead of alert
                }, function (response) {
                    if (response.status == 400 || response.status == 401) {
                        alert("An unknown error occured. Please try again later.");
                    }
                });
            }

            function clearInput() {
                reg.firstName = '';
                reg.lastName = '';
                reg.email = '';
                reg.password = '';
            };

        });
})();


