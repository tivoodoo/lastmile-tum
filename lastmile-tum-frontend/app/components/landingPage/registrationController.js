angular.module('lastMile')
    .controller('RegistrationCtrl', ['$scope',
        //'currUser', 'auth', function ($scope, currUser, auth) {
        function($scope) {
            $scope.registrationShown = false;

            $scope.register = register;
            $scope.clearInput = clearInput;

            function register(){
                console.log("test");
                clearInput();

            };

            function clearInput(){
                $scope.firstName = '';
                $scope.lastName = '';
                $scope.eMail = '';
                $scope.password = '';
            };
        }
    ]);