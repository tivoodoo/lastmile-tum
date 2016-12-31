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
                    userService.login(reg.email, reg.password).then(function () {
                        showSimpleToast('Registration and login successful!');
                        $rootScope.loggedIn = true;
                    }, function (response) {
                        if (response.status == "400" || response.status == "401") {
                            alert("Wrong username or password.");
                        } else {
                            alert("An unknown error occured. please try again later. Errorcode "+ response.status);
                        }
                    });
                    //TODO: Here rerouting instead of alert
                }, function (response) {
                    if (response.status == "400" || response.status == "401") {
                       alert("The email is already taken. Please enter a different one.")
                    } else {
                        alert("An unknown error occured. Please try again later.")
                    }
                });
            }

            function clearInput() {
                reg.firstName = '';
                reg.lastName = '';
                reg.email = '';
                reg.password = '';
            };

            //showSimpleToast function
            function showSimpleToast(txt) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(txt)
                        //.position("bottom right")
                        .hideDelay(3000)

                );
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