angular.module('lastMile')
    .controller('UserCtrl', ['$scope',
        //'currUser', 'auth', function ($scope, currUser, auth) {
    function($scope, $mdDialog, userService) {
        $scope.loggedIn = false;
        $scope.loginShown = false;
        $scope.login = logIn;

        // clear login input fields
        $.clearInput = function () {
            $('form').find('input[type=text], input[type=password], input[type=number], input[type=email], textarea').val('');
        };
        $('#showLogin').on('hidden.bs.modal', function () {
            $.clearInput();
        });

        function logIn(){
            alert("jo");
        }
    }
]);


/*
        $scope.loggedIn = false;
        $scope.isPremium = false;
        $scope.user = false;

        notify(); // initializes the scope on page load

        this.notify = notify;

        function notify() {
            $scope.loggedIn = auth.isAuthed();
            $scope.isPremium = $scope.loggedIn && currUser.getUser().isPremium;
            $scope.user = currUser.getUser();
        }

        currUser.observers.push(this);

    }]);
    */