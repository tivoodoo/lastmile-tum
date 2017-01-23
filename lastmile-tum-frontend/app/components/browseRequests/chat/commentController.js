/**
 * Created by DucTien on 19.01.2017.
 */

angular.module('lastMile')
  .controller('CommentController',
    ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', 'BACKEND_BASE_URL', 'notificationService',
      function ($scope, $rootScope, $http, $routeParams, $timeout, BACKEND_BASE_URL, notificationService) {

        // Attributes
        $scope.form = {
          chatMessage: ''
        };
        $scope.chatMessages = [];


        // Functions
        $scope.sendMessage = sendMessage;
        $scope.loadMessages = loadMessages;
        $scope.notify = notify;

        // notificationService.observers.push(this);
        //Notice the difference between this and $scope:
        //http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers
        notificationService.observers.push($scope);
        console.log("Observer pushed");

        // Implementation
        function sendMessage() {
          console.log("test:" + $rootScope.selectedRequestId);
          if ($scope.form.chatMessage == "")
            return;

          var msg = $scope.form.chatMessage;
          $scope.form.chatMessage = "";

          $http.post(BACKEND_BASE_URL + '/requests/comment/' + $rootScope.selectedRequestId, {
            text: msg
          })
            .then(function successCallback(response) {
              $scope.form.chatMessage = "";
              loadMessages();
              // notificationService.notifyObservers('chatMessage');
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
            console.log("CHAT RELOADED");
          }
        }

      }]);