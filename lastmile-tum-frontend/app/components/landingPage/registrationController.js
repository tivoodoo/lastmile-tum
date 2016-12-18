/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
    'use strict';

    angular
        .module('lastMile')
        .controller('RegisterCtrl', function ($rootScope, $scope, userService, $location, $mdToast) {
            $scope.registrationShown = false;
            $scope.clearInput = clearInput;
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
                    userService.login(reg.email, reg.password).then(function () {
                        alert("login successfull");
                        $scope.loggedIn = true;
                    }, function (response) {
                        alert(response.status);
                        if (response.status == "400" || response.status == "401") {
                            $scope.errorText = "Wrong username or password.";
                        } else {
                            $scope.errorText = "An unknown error occured. please try again later.";
                        }
                    });
                    //TODO: Here rerouting instead of alert
                }, function (response) {
                    alert(response.status);
                    if (response.status == "400" || response.status == "401") {
                        $scope.errorText = "Wrong username or password.";
                    } else {
                        $scope.errorText = "An unknown error occured. please try again later.";
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



/*angular.module('lastMile')
    .controller('RegistrationCtrl',['$scope','$http',
        //'currUser', 'auth', function ($scope, currUser, auth) {
        function ($scope, $http) {
            $scope.registrationShown = false;
            $scope.clearInput = clearInput;


            function clearInput() {
                $scope.firstName = '';
                $scope.lastName = '';
                $scope.eMail = '';
                $scope.password = '';
            };
        }
    ]);*/