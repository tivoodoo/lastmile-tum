/**
 * Created by DucTien on 19.01.2017.
 */

angular.module('lastMile')
  .controller('CommentController',
    ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', 'BACKEND_BASE_URL', 'notificationService','Notification','userService',
      function ($scope, $rootScope, $http, $routeParams, $timeout, BACKEND_BASE_URL, notificationService, Notification, userService) {

        // Attributes
        $scope.form = {
          chatMessage: ''
        };
        $scope.chatMessages = [];

        // Functions
        $scope.sendMessage = sendMessage;
        $scope.loadMessages = loadMessages;
        $scope.notify = notify;

        loadMessages();

        // notificationService.observers.push(this);
        //Notice the difference between this and $scope:
        //http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers
        notificationService.observers.push($scope);

        // Implementation
        function sendMessage() {
            console.log("send");
          if ($scope.form.chatMessage == "")
            return;

          var msg = $scope.form.chatMessage;
          $scope.form.chatMessage = "";

          $http.post(BACKEND_BASE_URL + '/requests/comment/' + $rootScope.selectedRequestId, {
            text: msg
          })
            .then(function successCallback(response) {
                var notification = new Notification();
                notification.notificationType = "NewMessage";
                notification.request = $rootScope.selectReqForComments._id;
                notification.recipient = $rootScope.selectReqForComments.requester;
                notification.sender = userService.getUserName()._id;;

                notification.$save(function (res) {
                    notificationService.notifyObservers('newNotification');
                }, function (err) {
                    console.log(err);
                });
              $scope.form.chatMessage = "";
              loadMessages();
              notificationService.notifyObservers('chatMessage');
            });
        }

        function loadMessages() {
          $http.get(BACKEND_BASE_URL + '/requests/comment/' + $rootScope.selectedRequestId)
            .then(function successCallback(response) {
              $scope.chatMessages = response.data;
              $timeout(scrollToLastMessage, 0);
            });
        }

        function scrollToLastMessage() {
          var position = $('.chatbox:last').offset().top;
          $('.chatbox').scrollTop(position);
        }


        function notify(msg) {
          if (msg == 'chatMessage') {
            loadMessages();
          }
        }

      }]);