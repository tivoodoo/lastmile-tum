angular.module('lastMile')
    .controller('RequestDetailsController',
        function ($scope, $rootScope, $uibModalInstance, thisRequest, Rating, Request, userService, notificationService, Notification, $http, BACKEND_BASE_URL) {
            $scope.selectedRequest = thisRequest;
            $scope.thisUser = userService.getUserName()._id;
            var setHeightModalMap = function () {
                var modalBodyHeight = $('.modal-body').height();
                var firstRowHeight = $('#detailsFirst').height();
                var vrHeight = 43;
                var mapHeight = modalBodyHeight - firstRowHeight - vrHeight;
                $('#modalMap').height(mapHeight + "px");
            };

            var setHeightChatWindow = function () {
                var modalMapHeight = $('#modalMap').height();
                var aboveTableHeight = 25 + 10;
                var buttonHeight = 35.5 + 10;
                var inputHeight = 35 + 15;
                var chatHeight = modalMapHeight - aboveTableHeight - buttonHeight - inputHeight;
                $('.chatbox').height(chatHeight + "px");
            };

            // make modal.height responsive
            $(window).resize(function () {
                //if ($('#showDetails').is(":visible")) {
                setHeightModalMap();
                setHeightChatWindow();
                //}
            });
            var showDetailsModal = function () {
                var start = $scope.selectedRequest.pickUpLocation;
                var goal = $scope.selectedRequest.deliverToLocation;

                var map2 = new google.maps.Map(document.getElementById('modalMap'), {});

                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map2
                });

                // Set destination, origin and travel mode.
                var request = {
                    origin: start,
                    destination: goal,
                    travelMode: 'DRIVING'
                };

                // Pass the directions request to the directions service.
                var directionsService = new google.maps.DirectionsService();
                directionsService.route(request, function (response, status) {
                    if (status == 'OK') {
                        // Display the route on the map.
                        directionsDisplay.setDirections(response);
                    }
                });
            };
            //jquery
            $(function () {
                setHeightModalMap();
                setHeightChatWindow();
                showDetailsModal();
            });


            if ($scope.selectedRequest.picture) {
                $scope.showDetailPicture = true;
            }
            else {
                $scope.showDetailPicture = false;
            }
            $rootScope.selectedRequestId = $scope.selectedRequest._id;
            notificationService.notifyObservers('chatMessage');


            $scope.reqAlreadyHaggled = function () {
                var isHaggled = false;
                var keepGoing = true;
                angular.forEach($scope.selectedRequest.haggledPrices, function (haggles) {
                    if (keepGoing) {
                        if (haggles.user == $scope.thisUser) {
                            isHaggled = true;
                            keepGoing = false;
                        }
                    }
                });
                return isHaggled;
            };


            $scope.accept = function () {
                $scope.selectedRequest.supplier = $scope.thisUser;

                if ($scope.selectedRequest.picture) {
                    delete $scope.selectedRequest.picture;
                }
                $http.post(BACKEND_BASE_URL + '/requests/acceptOffer/' + $scope.selectedRequest._id).then(function () {

                    var notification = new Notification();
                    notification.notificationType = "NewAcceptOffer";
                    notification.request = $scope.selectedRequest._id;
                    notification.recipient = $scope.selectedRequest.requester;
                    notification.sender = userService.getUserName()._id;

                    notification.$save(function (res) {
                    }, function (err) {
                        console.log(err);
                    });
                    $scope.selectedRequest.status = "AcceptOffer";
                    $uibModalInstance.close("Accept");

                }).catch(function (err) {

                        alert("error while accepting request");
                        $uibModalInstance.close("Error");
                    });


            };


            //======= Haggle ======
            // Attributes
            $scope.form = {
                hagglePrice: ''
            };

            $scope.sendHaggle = function () {
                // alert($scope.form.hagglePrice);
                if ($scope.form.hagglePrice == "")
                    return;

                var price = $scope.form.hagglePrice;
                $scope.form.hagglePrice = "";

                $http.post(BACKEND_BASE_URL + '/requests/haggle/' + $scope.selectedRequest._id, {
                    price: price
                })
                //All response status with code 200-299 is considered as success status
                    .then(function successCallback(response) {
                            var notification = new Notification();
                            notification.notificationType = "NewHaggle";
                            notification.request = $scope.selectedRequest._id;
                            notification.recipient = $scope.selectedRequest.requester;
                            notification.sender = $scope.thisUser;

                            notification.$save(function (res) {
                            }, function (err) {
                                console.log(err);
                            });
                            $scope.form.hagglePrice = "";
                            $uibModalInstance.close("Haggle");
                            alert("Offer sent!");
                        },
                        //All other status is considered as error status
                        //http://stackoverflow.com/questions/27507678/in-angular-http-service-how-can-i-catch-the-status-of-error
                        //https://docs.angularjs.org/api/ng/service/$http   Section: General usage
                        function errorCallback(response) {
                            alert("Error in the backend");
                        });
            };


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    );