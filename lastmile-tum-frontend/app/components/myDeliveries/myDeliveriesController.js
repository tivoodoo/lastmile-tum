angular.module('lastMile')
    .controller('MyDelCtrl',
        function ($scope, Request,Rating, userService, $filter, Notification, $uibModal) {
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

            $scope.openRequestDetails = function (request) {
                //var parentElem = parentSelector ?
                //  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    templateUrl: '../../shared/requestDetailsModal/requestDetailsModal.html',
                    controller: 'RequestDetailsController',
                    size: 'lg',
                    //appendTo: parentElem,
                    resolve: {
                        thisRequest: function () {
                            return request;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result == "Accept" || result == "Haggle") {
                        $location.path("/myDel");
                    }
                    else{
                        console.log("error while closing request detail modal");
                    }
                }, function (err) {

                });
            };

            //Open profile details modal
            $scope.openProfileDetails = function (requester) {
                //var parentElem = parentSelector ?
                //  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    templateUrl: '../../shared/profileDetailsModal/profileDetailsModal.html',
                    controller: 'ProfileDetailsController',
                    size: 'lg',
                    //appendTo: parentElem,
                    resolve: {
                        thisUserID: function () {
                            return requester;
                        },
                        pictureUpdated: function () {
                            return false;
                        },
                        updatedUserPicture: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                }, function (err) {

                });
            };

            $scope.actReq = new Request();
            $scope.setActReq = function (req) {
                $scope.actReq = req;
            };


            $scope.rating = new Rating();
            $scope.rating.comment = '';
            $scope.rate = function () {
                $scope.rating.type = 'S';
                $scope.rating.request = $scope.actReq._id;
                $scope.rating.ratedUser = $scope.actReq.requester;

                $scope.rating.$save()
                    .then(function(){
                        $scope.actReq.ratedBySupplier = true;
                        $('#showRating').modal('hide');
                    })
                    .catch(function(){
                        alert("An error occured while rating the requester");
                    });
            };

            Request.query()
                .$promise.then(function (data) {
                    //get deliveries
                var filteredDeliveries = $filter('filter')(data, {supplier: userService.getUserName()._id});
                $scope.requests = filteredDeliveries;

                //get haggles
                //var filteredHaggles = $filter('filter')(data, {supplier: userService.getUserName()._id});
//               $scope.haggles = filteredHaggles;
                if (filteredDeliveries.length == 0) {
                    $scope.createReqText = "Unfortunately, you have not accepted any requests yet. You can find available requests by clicking the 'Browse requests' button in the top toolbar!";
                }
                else {
                    $scope.hasRequests = true;
                }
            });

            $scope.cancelDelivery = function (req) {
                req.supplier = null;
                req.status = "Open";
                if (req.picture) {
                    delete req.picture;
                }
                req.$update({requestID: req._id})
                    .then(function (res) {
                        var notification = new Notification();
                        notification.notificationType = "NewCancel";
                        notification.request = req._id;
                        notification.recipient = req.requester;
                        notification.sender= userService.getUserName()._id;

                        notification.$save(function(res){
                        }, function (err) {
                            console.log(err);
                        });
                        var index = $scope.requests.indexOf(req);
                        $scope.requests.splice(index, 1);
                        //alert("delivery canceled");
                    })
                    .catch(function (err) {
                        console.log(err);
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
                        var notification = new Notification();
                        notification.notificationType = "NewDelivery";
                        notification.request = req._id;
                        notification.recipient = req.requester;
                        notification.sender= userService.getUserName()._id;

                        notification.$save(function(res){
                        }, function (err) {
                            console.log(err);
                        });
                        alert("request delivered");
                    })
                    .catch(function (err) {
                        alert("error while confirming delivery");
                    });

            }

        }
    );