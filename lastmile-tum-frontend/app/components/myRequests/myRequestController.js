angular.module('lastMile')
    .controller('MyReqCtrl',
        function ($scope, Request, userService, Rating, Upload, $filter, $rootScope, $location, BACKEND_BASE_URL) {
            var initStars = function() {
                $('#showRating').on('shown.bs.modal', function () {
                    $(function () {
                        $("#rateYo").rateYo({
                            starWidth: "40px",
                            rating: 3,
                            fullStar: true
                        });
                    });
                });

                $('#showRating').submit(function (e) {
                    $('#showRating').modal('hide');
                });
            };

            initStars();

            var actReq = new Request();
            $scope.setActReq = function (req) {
                actReq = req;
            };

            $scope.rating = new Rating();
            $scope.rate = function () {
                //$scope.rating.stars = $("#rateYo").rateYo("rating");
                $scope.rating.type = 'R';
                $scope.rating.stars = 4;
                $scope.rating.comment = "1234";
                $scope.rating.request = actReq;

                console.log(actReq);
                Upload.upload({
                    url: BACKEND_BASE_URL+'/rating/post',
                    data: $scope.rating
                })
                    .then(function(){
                        console.log("success")
                    })
                    .catch(function(){
                        console.log($scope.rating);
                    });
            };

/**
            $scope.request = new Request();

            $scope.postRequest = function () {
                if ($scope.request.pickUpTime > $scope.request.deliverTime) {
                    alert("The latest dropoff time lies before the earliest pickup time!")
                }
                else {
                    $scope.request.requester = userService.getUserName()._id;
                    $scope.request.status = "Open";

                    Upload.upload({
                        url: BACKEND_BASE_URL+'/requests',
                        data: {
                            file: $scope.request.picture,
                            request: $scope.request
                        }
                    }).then(function (resp) {
                        $location.path("/myReq");
                    }).catch(function (resp) {
                        alert("An unexpected error occured");
                    });

                }
            };

            /**
            var clearRating = function(){
                rating = '';
                $("#rateYo").rateYo({
                    rating: 3
                });
            };


            $scope.clearRating = clearRating();
             */
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
            };

            $scope.deleteRequest = function (req) {
                req.$remove().then(function () {
                    alert("request successfully deleted");
                    var index = $scope.requests.indexOf(req);
                    $scope.requests.splice(index, 1);
                })
                    .catch(function (err) {
                        alert("could not delete request");
                    })

            };


        }
    );