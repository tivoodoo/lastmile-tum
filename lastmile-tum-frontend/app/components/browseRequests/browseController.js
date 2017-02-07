angular.module('lastMile')
    .controller('BrowseCtrl',
        function ($scope, $rootScope, $http, BACKEND_BASE_URL,
                  Request, $filter, $uibModal, $location, userService, notificationService, Notification, $uibModal) {
            $scope.filterShowed = false;
            $scope.lowPrice = 0;
            $scope.highPrice = 1000;
            $scope.sizefilters = [];
            $scope.sizefilters.S = true;
            $scope.sizefilters.M = true;
            $scope.sizefilters.L = true;
            $scope.sizefilters.XL = true;
            $scope.thisUser = userService.getUserName()._id;

            $scope.showHaggle = false;

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
                    else{
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
            };


            //-------------------FILTERING-----------------
            $scope.applyFilter = function () {
                if ($scope.filterDeliverTime && $scope.filterPickUpTime && moment($scope.filterDeliverTime) < moment($scope.filterPickUpTime)) {
                    alert("The earliest pickup filter date needs to be sooner than the latest dropoff filter date");
                }
                if ($scope.lowPrice > $scope.highPrice) {
                    alert("The right price has to be higher or equal than the left price");
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
/*app.filter("OpenHaggled", function ($filter) {
    return function (items) {
        return $filter('filter')(items, function (value, index, array) {
            if (value.status == "Accepted" || value.status == "Haggled") {
                return true;
            }
            else {
                return false
            }
        });
    };
});*/
//datepicker: https://www.grobmeier.de/angular-js-binding-to-jquery-ui-datepicker-example-07092012.html
//datepicker: http://jsfiddle.net/xB6c2/121/