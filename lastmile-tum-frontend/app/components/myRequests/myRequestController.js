angular.module('lastMile')
    .controller('MyReqCtrl',
        function ($scope, Request, userService, $filter, $rootScope, $location) {
            Request.query()
                .$promise.then(function (data) {
                var filteredRequests = $filter('filter')(data, {requester: userService.getUserName()._id});
                if (filteredRequests.length == 0) {
                    $scope.createReqText = "Unfortunately, you do not have any requests yet. To create one, click the 'Create request' button in the top toolbar!";
                }
                else {
                    $scope.hasRequests = true;
                }
                $scope.requests = filteredRequests;
            });

            $scope.editRequest = function (req) {
                $rootScope.requestToEdit = req
                $location.path("/editReq");
            }

        }
    );