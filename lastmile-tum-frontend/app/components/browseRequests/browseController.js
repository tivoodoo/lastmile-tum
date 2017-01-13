angular.module('lastMile')
    .controller('BrowseCtrl',
        function ($scope, Request, $filter, $uibModal, $location, userService) {
            $scope.filterShowed = false;
            $scope.lowPrice = 0;
            $scope.highPrice = 1000;



            Request.query()
                .$promise.then(function (data) {
                var filteredRequests = $filter('filter')(data, {status: "Open"});
                $scope.requestsBackup = filteredRequests;
                $scope.requests = filteredRequests;
                $scope.initMap();

                setHeightModalMap();
                setHeightChatWindow();

            })
                .catch(function (err) {
                    console.log(err);
                    alert("something went wrong");
                });


            $scope.selectRequest = function (req) {
                $scope.selectedRequest = req;
            };

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



            //$scope.showDetailsModal = showDetailsModal;

            $scope.initMap = function() {
                var centerGer = {lat: 51.1657, lng: 10.4515};
                var map1 = new google.maps.Map(document.getElementById('browsemap'), {
                    center: centerGer,
                    zoom: 6
                });
                angular.forEach($scope.requests, function (request) {
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

            $scope.filterPrice= function(){
                return function(item){
                    return (item.price >= $scope.lowPrice&& item.price <= $scope.highPrice);
                }
            };

            $scope.clearInput = function(){
                $scope.filterPickUpLocation = '';
                $scope.filterDeliverToLocation= '';
                /*$scope.browseFilter.pickUpTime= '';
                $scope.browseFilter.deliverTime = '';
                $scope.size = 'XL';*/
                $scope.lowPrice = 0;
                $scope.highPrice = 1000;

                $scope.filterShowed = false;
            };

            $('#showDetails').on('shown.bs.modal', function () {
                showDetailsModal();
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
                //var firstRowHeight = $('#showDetails .modal-dialog .modal-body #detailsFirst').height();
                var firstRowHeight = 150;
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




        }
    );

//datepicker: https://www.grobmeier.de/angular-js-binding-to-jquery-ui-datepicker-example-07092012.html
//datepicker: http://jsfiddle.net/xB6c2/121/