angular.module('lastMile')
    .controller('MyReqCtrl',
        function ($scope, Request, userService) {
            Request.query({requester: userService.getUserName()._id})
                .$promise.then(function (data) {
                if (data.length == 0) {
                    $scope.createReqText = "Unfortunately, you do not have any requests yet. To create one, click the 'Create request' button in the top toolbar!";
                }
                else {
                    $scope.hasRequests = true;
                }
                $scope.requests = data;
            });

        }
    );