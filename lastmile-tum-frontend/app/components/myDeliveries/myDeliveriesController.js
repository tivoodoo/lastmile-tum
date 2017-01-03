angular.module('lastMile')
    .controller('MyDelCtrl',
        function ($scope, Request, userService, $filter) {
            Request.query()
                .$promise.then(function (data) {
                var filteredDeliveries = $filter('filter')(data, {supplier: userService.getUserName()._id});
                if (filteredDeliveries.length == 0) {
                    $scope.createReqText = "Unfortunately, you have not accepted any requests yet. You can find available requests by clicking the 'Browse requests' button in the top toolbar!";
                }
                else {
                    $scope.hasRequests = true;
                }
                $scope.requests = filteredDeliveries;
            });

        }
    );