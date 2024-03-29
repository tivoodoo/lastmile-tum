angular.module('lastMile')
  .controller('UserCtrl',
    //'currUser', 'auth', function ($scope, currUser, auth) {
    function ($scope, $rootScope, $mdDialog, userService, $mdToast, $location, Notification,
              notificationService, $filter, Request, User, $window) {
      $scope.$window = $window;
      var user = this;
      $rootScope.loggedIn = false;
      $scope.loginShown = false;
      $scope.login = login;
      $scope.logout = logout;

      $scope.notificationsShown = false;
      $scope.notify = notify;
      notificationService.observers.push($scope);


      function notify(msg) {
        if (msg == 'newNotification') {
          $scope.getNotifications();
        }
      }

      $scope.showNotifications = function () {
        $scope.notificationsShown = !$scope.notificationsShown;
      };

      $scope.getNotifications = function () {
        Notification.query().$promise.then(function (data) {
          var filteredNotifications = $filter('filter')(data, {recipient: userService.getUserName()._id});
          /*if (filteredNotifications.length == 0) {
           $scope.createReqText = "Unfortunately, you do not have any requests yet. To create one, click the 'Create request' button in the top toolbar!";
           }
           else {
           $scope.hasRequests = true;
           }*/
          angular.forEach(filteredNotifications, function (notification) {
            Request.get({requestID: notification.request}, function (req) {
              notification.requestName = req.name;
            });
            User.get({userID: notification.sender}, function (user) {
              notification.userFirstName = user.firstName;
              notification.userLastName = user.lastName;
            });
          });
          $scope.notifications = filteredNotifications;

        });
      };
      $scope.getNotifications();

      // handle behaviour when clicking outside

      $scope.toggleNotifications = function () {
        $scope.notificationsShown = !$scope.notificationsShown;

        if ($scope.notificationsShown) {
          $scope.$window.onclick = function (event) {
            closeSearchWhenClickingElsewhere(event, $scope.toggleNotifications);
          };
        } else {
          $scope.notificationsShown = false;
          $scope.$window.onclick = null;
          $scope.$apply();
        }
      };

      function closeSearchWhenClickingElsewhere(event, callbackOnClose) {

        var clickedElement = event.target;

        if (!clickedElement) return;

        var elementClasses = clickedElement.classList;

        var clickedOnSearchDrawer = elementClasses.contains('notificationButton') || elementClasses.contains('inNotificationContainer') || (clickedElement.parentElement !== null && clickedElement.parentElement.classList.contains('inNotificationContainer'));

        if (!clickedOnSearchDrawer) {
          callbackOnClose();
          return;
        }

      }


      $scope.removeNotification = function (notification) {
        notification.$remove({notificationID: notification._id}, function (succ) {
          var index = $scope.notifications.indexOf(notification);
          $scope.notifications.splice(index, 1);
          if ($scope.notifications.length == 0) {
            $scope.notificationsShown = false;
          }
        }, function (err) {
          alert(err);
        })
      };
      $scope.removeAllNotifications = function () {
        angular.forEach($scope.notifications, function (notification) {
          notification.$remove({notificationID: notification._id}, function (succ) {
          }, function (err) {
            alert(err);
          });
          $scope.notifications = [];
          $scope.notificationsShown = false;

        });
      };


      //should keep the loggedIn variable updated (after registration) but doesn't work yet
      $scope.$watch(function () {
        return userService.loggedIn();
      }, function (loggedIn) {
        $rootScope.loggedIn = loggedIn;
        if (loggedIn && !$scope.user) {
          $scope.user = userService.getUser();
        }
      });
      //showSimpleToast function

        $scope.showToast = showSimpleToast;
      function showSimpleToast(txt) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(txt)
            .position("top left")
            .hideDelay(3000)
        );
      };

      // clear login input fields
      $.clearInput = function () {
        $('form').find('input[type=text], input[type=password], input[type=number], input[type=email], textarea').val('');
      };

      $('#showLogin').on('hidden.bs.modal', function () {
        $.clearInput();
      });
      $('#showLogin').submit(function (e) {
        $('#showLogin').modal('hide');
      });


      function login() {
        userService.login(user.email, user.password).then(function () {
          $scope.getNotifications();
          $rootScope.loggedIn = true;
          showSimpleToast('You were logged in successful');
        }, function (response) {
          if (response.status == "400" || response.status == "401") {
            alert("Wrong username or password.")
          } else {
            alert("An unknown error occured. please try again later. Errorcode " + response.status)
          }
        })
      };

      function logout() {
        userService.logout();
        $rootScope.loggedIn = false;
        $scope.notifications = null;
        showSimpleToast('Logout successful');
        $location.path("/");

      };


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