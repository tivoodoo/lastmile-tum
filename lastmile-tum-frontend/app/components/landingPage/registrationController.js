angular.module('lastMile')
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
    ]);