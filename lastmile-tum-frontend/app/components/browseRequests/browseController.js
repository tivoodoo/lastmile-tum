angular.module('lastMile')
    .controller('BrowseCtrl',
        function ($scope, $rootScope, $http, BACKEND_BASE_URL,
                  Request, $filter, $uibModal, $location, userService, notificationService, Notification, $q) {
            $scope.filterShowed = false;
            $scope.lowPrice = 0;
            $scope.highPrice = 1000;
            $scope.sizefilters = [];
            $scope.sizefilters.S = true;
            $scope.sizefilters.M = true;
            $scope.sizefilters.L = true;
            $scope.sizefilters.XL = true;
            $scope.enableDetourFilter = false;
            $scope.detour = 60;
            $scope.thisUser = userService.getUserName()._id;

            $scope.showHaggle = false;

            $scope.adjustDetourCheckbox = function () {
                if($scope.filterPickUpLocation == "" || $scope.filterDeliverToLocation == "" )
                    $scope.enableDetourFilter = false;
            };
            //show request details modal
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
                    else {
                        console.log("error while closing request detail modal");
                    }
                }, function (err) {

                });
            };

            Request.query()
                .$promise.then(function (data) {
                var filteredRequests = data.filter(function (req) {
                    return req.status == "Open" || req.status == "Haggled" || req.status == "AcceptOffer"
                });
                $scope.backupRequests = filteredRequests;
                $scope.requests = filteredRequests;
                $scope.initMap($scope.requests);
            })
                .catch(function (err) {
                    console.log(err);
                    alert("something went wrong");
                });


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
                new AutocompleteDirectionsHandler(map1);
            };
            function AutocompleteDirectionsHandler(map) {
                this.map = map;

                var originInput = document.getElementById('filterPickUpLocation');
                var destinationInput = document.getElementById('filterDeliverToLocation');

                var originAutocomplete = new google.maps.places.Autocomplete(
                    originInput, {placeIdOnly: true});
                var destinationAutocomplete = new google.maps.places.Autocomplete(
                    destinationInput, {placeIdOnly: true});
                this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
                this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
            };


            AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
                var me = this;
                autocomplete.bindTo('bounds', this.map);
                autocomplete.addListener('place_changed', function () {
                    var place = autocomplete.getPlace();
                    if (!place.place_id) {
                        window.alert("Please select an option from the dropdown list.");
                        return;
                    }
                    if (mode === 'ORIG') {
                        $scope.filterPickUpLocation = place.name;

                    } else {
                        $scope.filterDeliverToLocation = place.name;
                    }
                });
            };


            //-------------------FILTERING-----------------
            $scope.applyFilter = function () {
                if ($scope.filterDeliverTime && $scope.filterPickUpTime && moment($scope.filterDeliverTime) < moment($scope.filterPickUpTime)) {
                    alert("The earliest pickup filter date needs to be sooner than the latest dropoff filter date");
                }
                if ($scope.lowPrice > $scope.highPrice) {
                    alert("The minimum price cannot be higher than the maximum price!");
                }
                else {

                    $scope.requests = $scope.backupRequests;

                    if ($scope.enableDetourFilter) {
                        var detourFilterValue = $scope.detour * 60;
                        console.log("detourFilterValue: " + detourFilterValue);
                        var service = new google.maps.DistanceMatrixService();
                        var prom = [];
                        angular.forEach($scope.requests, function (request) {
                            var deferred = $q.defer();
                            prom.push(deferred.promise);
                            var detourValue = 0;
                            var originFilter = $scope.filterPickUpLocation;
                            var originRequest = request.pickUpLocation;
                            var destinationRequest = request.deliverToLocation;
                            var destinationFilter = $scope.filterDeliverToLocation;

                            service.getDistanceMatrix(
                                {
                                    origins: [originFilter, originRequest, destinationRequest],
                                    destinations: [originRequest, destinationRequest, destinationFilter],
                                    travelMode: 'DRIVING'
                                }, function (response, status) {
                                    if (status == 'OK') {
                                        var originFilterToDestinationfilter = response.rows[0].elements[2].duration.value;
                                        var originFilterToOriginRequest = response.rows[0].elements[0].duration.value;
                                        var originRequestToDestinationRequest = response.rows[1].elements[1].duration.value;
                                        var destinationRequestToDestinationfilter = response.rows[2].elements[2].duration.value;

                                        detourValue = originFilterToOriginRequest + originRequestToDestinationRequest + destinationRequestToDestinationfilter - originFilterToDestinationfilter;
                                        console.log("detour value for " + request.name + ": " + detourValue);
                                        if (detourValue > detourFilterValue) {
                                            console.log("remove " + request.name + "from requests");
                                            $scope.$apply(function () {
                                                $scope.requests = $filter('filter')($scope.requests, {_id: '!' + request._id});
                                            });
                                            console.log("remaining requests:");
                                            console.log($scope.requests);

                                        }
                                        deferred.resolve();
                                    }
                                    else {
                                        console.log("error: " + status);
                                    }
                                });


                        });
                        $q.all(prom).then(function () {
                            console.log($scope.filteredRequests);
                            console.log("after all");
                            $scope.initMap($scope.filteredRequests);
                            $scope.filterShowed = false;
                        });
                    }
                    else {
                        console.log($scope.filteredRequests);
                        $scope.initMap($scope.filteredRequests);
                        $scope.filterShowed = false;
                    }


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
                $scope.enableDetourFilter = false;
                $scope.filterShowed = false;
                $scope.initMap($scope.requests);
            };


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
