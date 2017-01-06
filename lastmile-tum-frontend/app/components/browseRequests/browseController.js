angular.module('lastMile')
    .controller('BrowseCtrl',
        function ($scope, Request, $filter, $uibModal, $location, userService) {
            $scope.filterShowed = false;

            Request.query()
                .$promise.then(function (data) {
                var filteredRequests = $filter('filter')(data, {status: "Open"});
                $scope.requestsBackup = filteredRequests;
                $scope.requests = filteredRequests;
            })
                .catch(function (err) {
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


            $scope.initMap = initMap;
            $scope.clearInput = clearInput;
            //$scope.showDetailsModal = showDetailsModal;

            function initMap() {
                /**
                 var munich = {lat: 48.1548895, lng: 11.4717965};
                 var map1 = new google.maps.Map(document.getElementById('browsemap'), {
                    zoom: 10,
                    center: munich
                });

                 var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
                 */
                var centerGer = {lat: 51.1657, lng: 10.4515};
                var munich = {lat: 48.1493505, lng: 11.567825500000026};
                var dresden = {lat: 51.03569479999999, lng: 13.718207099999972};
                var stuttgart = {lat: 48.77170999999999, lng: 9.179779999999937};
                var augsburg = {lat: 48.36677999999999, lng: 10.911810100000025};
                var kassel = {lat: 51.317038, lng: 9.482126};
                var leipzig = {lat: 51.353259, lng: 12.377678};
                var nuernberg = {lat: 49.4254092, lng: 11.079655300000013};

                var map1 = new google.maps.Map(document.getElementById('browsemap'), {
                    center: centerGer,
                    zoom: 6
                });

                var directionsDisplay1 = new google.maps.DirectionsRenderer({
                    map: map1,
                    preserveViewport: true
                });
                var directionsDisplay2 = new google.maps.DirectionsRenderer({
                    map: map1,
                    preserveViewport: true
                });
                var directionsDisplay3 = new google.maps.DirectionsRenderer({
                    map: map1,
                    preserveViewport: true
                });

                // Set destination, origin and travel mode.
                var request1 = {
                    destination: dresden,
                    origin: munich,
                    travelMode: 'DRIVING'
                };
                var request2 = {
                    destination: augsburg,
                    origin: stuttgart,
                    travelMode: 'DRIVING'
                };
                var request3 = {
                    destination: kassel,
                    origin: leipzig,
                    travelMode: 'DRIVING'
                };

                // Pass the directions request to the directions service.
                var directionsService1 = new google.maps.DirectionsService();
                var directionsService2 = new google.maps.DirectionsService();
                var directionsService3 = new google.maps.DirectionsService();

                directionsService1.route(request1, function (response, status) {
                    if (status == 'OK') {
                        // Display the route on the map.
                        directionsDisplay1.setDirections(response);
                    }
                });
                directionsService2.route(request2, function (response, status) {
                    if (status == 'OK') {
                        // Display the route on the map.
                        directionsDisplay2.setDirections(response);
                    }
                });
                directionsService3.route(request3, function (response, status) {
                    if (status == 'OK') {
                        // Display the route on the map.
                        directionsDisplay3.setDirections(response);
                    }
                });

                /**
                 var polylineOptions = new google.maps.Polyline({
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                 var polylineOptionsMouseOver = new google.maps.Polyline({
                    strokeColor: '#ffffff',
                    strokeOpacity: 1.0,
                    strokeWeight: 10
                });

                 $('.requestHeader').mouseenter(function(){
                    switch (this.innerText) {
                        case "Football":
                            directionsDisplay1.setOptions({
                                'polylineOptions':polylineOptionsMouseOver,
                                'preserveViewport': true
                            });
                            directionsDisplay1.setMap(map1);
                            break;
                        case "Chair":
                            directionsDisplay2.setOptions({
                                'polylineOptions':polylineOptionsMouseOver,
                                'preserveViewport': true
                            });
                            directionsDisplay2.setMap(map1);
                            break;
                        case "Plant":
                            directionsDisplay3.setOptions({
                                'polylineOptions':polylineOptionsMouseOver,
                                'preserveViewport': true
                            });
                            directionsDisplay3.setMap(map1);
                            break;
                    };
                });
                 $('.requestHeader').mouseleave(function(){
                    switch (this.innerText) {
                        case "Football":
                            directionsDisplay1.setOptions({
                                'polylineOptions':polylineOptions,
                                'preserveViewport': true
                            });
                            directionsDisplay1.setMap(map1);
                            break;
                        case "Chair":
                            directionsDisplay2.setOptions({
                                'polylineOptions':polylineOptions,
                                'preserveViewport': true
                            });
                            directionsDisplay2.setMap(map1);
                            break;
                        case "Plant":
                            directionsDisplay3.setOptions({
                                'polylineOptions':polylineOptions,
                                'preserveViewport': true
                            });
                            directionsDisplay3.setMap(map1);
                            break;
                    };
                });
                 */
            };

            function clearInput() {
                $scope.fromCity = '';
                $scope.toCity = '';
                $scope.pickup = '';
                $scope.dropoff = '';
                $scope.size = 'XL';
                $scope.lowPrice = '';
                $scope.highPrice = '';

                $scope.filterShowed = false;
            };

            $('#showDetails').on('shown.bs.modal', function () {
                showDetailsModal();
            });

            var showDetailsModal = function () {
                var start = $scope.selectedRequest.pickUpLocation;
                var goal = $scope.selectedRequest.deliverToLocation;

                var map2 = new google.maps.Map(document.getElementById('modalMap'), {

                });

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

            $scope.initMap();
            setHeightModalMap();
            setHeightChatWindow();


        }
    );

//datepicker: https://www.grobmeier.de/angular-js-binding-to-jquery-ui-datepicker-example-07092012.html
//datepicker: http://jsfiddle.net/xB6c2/121/