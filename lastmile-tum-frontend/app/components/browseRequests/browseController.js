angular.module('lastMile')
    .controller('BrowseCtrl',
        function ($scope, $rootScope, Request, $filter, $uibModal, $location, userService, notificationService) {
            $scope.filterShowed = false;
            $scope.lowPrice = 0;
            $scope.highPrice = 1000;
            $scope.sizefilters = [];
            $scope.sizefilters.S = true;
            $scope.sizefilters.M = true;
            $scope.sizefilters.L = true;
            $scope.sizefilters.XL = true;


            Request.query()
                .$promise.then(function (data) {
                var filteredRequests = $filter('filter')(data, {status: "Open"});
                $scope.requests = filteredRequests;
                $scope.initMap($scope.requests);
            })
                .catch(function (err) {
                    console.log(err);
                    alert("something went wrong");
                });


            $scope.selectRequest = function (req) {
                $scope.selectedRequest = req;
                $rootScope.selectedRequestId = req._id;
              notificationService.notifyObservers('chatMessage');
            };

            $scope.goToRequestDetail = function (){
              console.log("go to request derail");
            }

            $scope.accept = function () {
                $scope.selectedRequest.supplier = userService.getUserName()._id
                if ($scope.selectedRequest.supplier === $scope.selectedRequest.requester) {
                    alert("You cannot accept your own requests");
                }
                else {

                    $scope.selectedRequest.status = "Accepted";
                    $scope.selectedRequest.$update({requestID: $scope.selectedRequest._id})
                        .then(function (res) {
                            $('#showDetails').modal('hide');
                            $location.path("/myDel");

                        })
                        .catch(function (err) {
                            alert("error while accepting request");
                        });

                }
            };


            $scope.initMap = function (reqarray) {
                var centerGer = {lat: 51.1657, lng: 10.4515};
                var map1 = new google.maps.Map(document.getElementById('browsemap'), {
                    center: centerGer,
                    zoom: 6
                });
                angular.forEach(reqarray, function (request) {
                    new google.maps.DirectionsService().route({
                        origin: request.pickUpLocation,
                        destination: request.deliverToLocation,
                        travelMode: 'DRIVING'
                    }, function (response, status) {
                        if (status == 'OK') {
                            // Display the route on the map.
                            new google.maps.DirectionsRenderer({
                                map: map1,
                                preserveViewport: true
                            }).setDirections(response);
                        }
                    });
                });
            };

            //-------------------FILTERING-----------------
            $scope.applyFilter = function () {
                if ($scope.filterDeliverTime && $scope.filterPickUpTime && moment($scope.filterDeliverTime) < moment($scope.filterPickUpTime)) {
                    alert("The earliest pickup filter date needs to be sooner than the latest dropoff filter date");
                }
                else {
                    $scope.initMap($scope.filteredRequests);
                    $scope.filterShowed = false;
                }
            };


            $scope.filterPrice = function () {
                return function (item) {
                    return (item.price >= $scope.lowPrice && item.price <= $scope.highPrice);
                }
            };

            $scope.openDatepickerFrom = function () {
                $scope.isOpenFrom = true;
            };
            $scope.openDatepickerTo = function () {
                $scope.isOpenTo = true;
            };
            $scope.dateOptions = {
                minDate: new Date()
            };

            $scope.clearInput = function () {
                $scope.filterPickUpLocation = '';
                $scope.filterDeliverToLocation = '';
                $scope.filterPickUpTime = null;
                $scope.filterDeliverTime = null;
                $scope.sizefilters.S = true;
                $scope.sizefilters.M = true;
                $scope.sizefilters.L = true;
                $scope.sizefilters.XL = true;
                $scope.lowPrice = 0;
                $scope.highPrice = 1000;

                $scope.filterShowed = false;
                $scope.initMap($scope.requests);
            };

            $('#showDetails').on('shown.bs.modal', function () {
                showDetailsModal();
                setHeightModalMap();
                setHeightChatWindow();
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

            var setHeightModalMap = function () {
                var modalBodyHeight = $('#showDetails .modal-dialog .modal-body').height();
                var firstRowHeight = $('#detailsFirst').height();
                var vrHeight = 43;
                var mapHeight = modalBodyHeight - firstRowHeight - vrHeight;
                $('#modalMap').height(mapHeight + "px");
            };

            var setHeightChatWindow = function () {
                var modalMapHeight = $('#modalMap').height();
                var aboveTableHeight = 21 + 15 + 2;
                var buttonHeight = 35;
                var inputHeight = 50 + 15;
                var chatHeight = modalMapHeight - aboveTableHeight - buttonHeight - inputHeight;
                $('#tableDiv').height(chatHeight + "px");
            };

            // make modal.height responsive
            $(window).resize(function () {
                if ($('#showDetails').is(":visible")) {
                    setHeightModalMap();
                    setHeightChatWindow();
                }
            });
        }
    );

app.filter('bysize', function () {
    return function (requests, sizes) {
        var items = {
            sizes: sizes,
            out: []
        };
        angular.forEach(requests, function (value, key) {
            if (this.sizes[value.size] === true) {
                this.out.push(value);
            }
        }, items);
        return items.out;
    };
});

app.filter("myfilterTo", function ($filter) {
    return function (items, to) {
        return $filter('filter')(items, function (value, index, array) {
            if (to == null) {
                return true;
            }
            else {
                return moment(value.pickUpTime) <= moment(to);
            }
        });
    };
});

app.filter("myfilterFrom", function ($filter) {
    return function (items, from) {
        return $filter('filter')(items, function (value, index, array) {
            if (from == null) {
                return true;
            }
            else {
                return moment(value.deliverTime) >= moment(from);
            }
        });
    };
});
//datepicker: https://www.grobmeier.de/angular-js-binding-to-jquery-ui-datepicker-example-07092012.html
//datepicker: http://jsfiddle.net/xB6c2/121/