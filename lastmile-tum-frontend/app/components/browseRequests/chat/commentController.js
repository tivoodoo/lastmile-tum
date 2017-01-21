/**
 * Created by DucTien on 19.01.2017.
 */

angular.module('lastMile')
  .controller('CommentController',
    ['$scope', '$rootScope', '$http', '$routeParams', '$timeout',
      function($scope, $rootScope, $http, $routeParams, $timeout){

  // Attributes
  $scope.form = {
    chatMessage: ''
  };
  $scope.chatMessages = [];


  // Functions
  $scope.sendMessage = sendMessage;


  // Init
  loadMessages();

  // Implementation
  function sendMessage() {
    console.log("test:" + $rootScope.selectedRequestId);
    if ($scope.form.chatMessage == "")
      return;

    var msg = $scope.form.chatMessage;
    $scope.form.chatMessage = "";

    $http.post('http://localhost:4000/request/comment/' + $rootScope.selectedRequestId, {
      text: msg
    })
      .then(function successCallback(response) {
        $scope.form.chatMessage = "";
        loadMessages();
      });
  }

  function loadMessages() {
    // $http.get('http://localhost:4000/request/comment/' + $rootScope.selectedRequestId)
    //   .then(function successCallback(response) {
    //     $scope.chatMessages = response.data;
    //     $timeout(scrollToLastMessage, 0);
    //   });
  }

  function scrollToLastMessage() {
    var position = $('.chatbox:last').offset().top;
    $('.chatbox').scrollTop(position);
  }

}]);