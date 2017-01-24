angular.module('lastMile')
    .controller('MyDelCtrl',
        function ($scope, Request,Rating, userService, $filter) {
            //jquery for rating
            $(function () {
                $("#rateYoDel").rateYo({
                    starWidth: "40px",
                    rating: 3,
                    fullStar: true
                });

                $("#rateYoDel").rateYo()
                    .on("rateyo.set", function (e, data) {
                        $scope.rating.stars = data.rating;
                    });
            });


            var actReq = new Request();
            $scope.setActReq = function (req) {
                actReq = req;
            };


            $scope.rating = new Rating();
            $scope.rate = function () {
                $scope.rating.type = 'S';
                $scope.rating.request = actReq._id;

                console.log($scope.rating);
                $scope.rating.$save()
                    .then(function(){
                        actReq.ratedBySupplier = true;
                        $('#showRating').modal('hide');
                    })
                    .catch(function(){
                        alert("An error occured while rating the requester");
                    });
            };

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

            $scope.cancelDelivery = function (req) {
                req.supplier = null;
                req.status = "Open";
                if (req.picture) {
                    delete req.picture;
                }
                req.$update({requestID: req._id})
                    .then(function (res) {
                        var index = $scope.requests.indexOf(req);
                        $scope.requests.splice(index, 1);
                        //alert("delivery canceled");
                    })
                    .catch(function (err) {
                        alert("error while canceling delivery");
                    });
            };

            $scope.markDelivered = function (req) {
                req.status = "Delivered";
                if (req.picture) {
                    delete req.picture;
                }
                req.$update({requestID: req._id})
                    .then(function (res) {
                        alert("request delivered");
                    })
                    .catch(function (err) {
                        alert("error while confirming delivery");
                    });

            }

        }
    );