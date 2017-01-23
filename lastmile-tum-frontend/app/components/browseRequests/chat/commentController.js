/**
 * Created by DucTien on 19.01.2017.
 */

angular.module('lastMile')
  .controller('CommentController',
    ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', 'BACKEND_BASE_URL',
      function($scope, $rootScope, $http, $routeParams, $timeout, BACKEND_BASE_URL){

  // Attributes
  $scope.form = {
    chatMessage: ''
  };
  $scope.chatMessages = [];


  // Functions
  $scope.sendMessage = sendMessage;
        $scope.loadMessages = loadMessages;

  // Implementation
  function sendMessage() {
    console.log("test:" + $rootScope.selectedRequestId);
    if ($scope.form.chatMessage == "")
      return;

    var msg = $scope.form.chatMessage;
    $scope.form.chatMessage = "";

    $http.post(BACKEND_BASE_URL +'/requests/comment/' + $rootScope.selectedRequestId, {
      text: msg
    })
      .then(function successCallback(response) {
        $scope.form.chatMessage = "";
        loadMessages();
      });
  }

  function loadMessages() {
    $http.get(BACKEND_BASE_URL +'/requests/comment/' + $rootScope.selectedRequestId)
      .then(function successCallback(response) {
        $scope.chatMessages = response.data;
        $timeout(scrollToLastMessage, 0);
      });
  }

  function scrollToLastMessage() {
    var position = $('.chatbox:last').offset().top;
    $('.chatbox').scrollTop(position);
  }

}]);