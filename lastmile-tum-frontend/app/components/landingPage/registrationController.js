angular.module('lastMile')
    .controller('RegistrationCtrl',['$scope','$http',
        //'currUser', 'auth', function ($scope, currUser, auth) {
        function ($scope, $http) {
            $scope.registrationShown = false;
            $scope.register = register;
            $scope.clearInput = clearInput;


            function register() {
                $http({
                    method: 'POST',
                    url: 'http://localhost:4000/user/signup',
                    data: { email: $scope.email,
                        password: $scope.password,
                        firstName: $scope.firstName,
                        lastName: $scope.lastName},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .success(function (reponse) {
                        
                    })
                    .error(function (error) {
                        
                    });
            };
            /*
             currUser.register($scope.email, $scope.password, $scope.firstName, $scope.lastName, $scope.email)
             .then(function () {
             //$rootScope.$broadcast('userLoggedIn', currUser.getUser());

             }, function (response) {
             debugger;
             if (response.status == 400 || response.status == 401) {
             $scope.errorText = "An unknown error occured. please try again later.";
             }
             });
             */
            function clearInput() {
                $scope.firstName = '';
                $scope.lastName = '';
                $scope.eMail = '';
                $scope.password = '';
            };
        }
    ]);