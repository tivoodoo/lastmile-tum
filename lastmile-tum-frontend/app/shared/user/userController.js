angular.module('lastMile')
    .controller('UserCtrl',
        //'currUser', 'auth', function ($scope, currUser, auth) {
    function($scope, $mdDialog, userService) {
        var user= this;
        $scope.loggedIn = false;
        $scope.loginShown = false;
        $scope.login = login;

        //should keep the loggedIn variable updated (after registration) but doesn't work yet
       $scope.$watch(function () {
            return userService.loggedIn();
        }, function (loggedIn) {
           $scope.loggedIn = loggedIn;
            if (loggedIn && !$scope.user) {
                $scope.user = userService.getUser();
            }
        });

        // clear login input fields
        $.clearInput = function () {
            $('form').find('input[type=text], input[type=password], input[type=number], input[type=email], textarea').val('');
        };
        $('#showLogin').on('hidden.bs.modal', function () {
            $.clearInput();
        });
        $('#showLogin').submit(function(e) {
            $('#showLogin').modal('hide');
        });


        function login() {
            userService.login(user.email, user.password).then(function () {
                alert("login successfull");
                $scope.loggedIn = true;
            }, function (response) {
                alert(response.status);
                if (response.status == "400" || response.status == "401") {
                    $scope.errorText = "Wrong username or password.";
                } else {
                    $scope.errorText = "An unknown error occured. please try again later.";
                }
            })
        }

    }
);


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