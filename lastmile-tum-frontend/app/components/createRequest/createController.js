angular.module('lastMile')
    .controller('CreateCtrl',
        function ($scope, Request, userService, $location, Upload, BACKEND_BASE_URL) {
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

            $scope.openDatepickerFrom = function () {
                $scope.isOpenFrom = true;
            };
            $scope.openDatepickerTo = function () {
                $scope.isOpenTo = true;
            };
            $scope.dateOptions = {
                minDate: new Date()
            };


            var initPicSize = function () {
                var h = $('.pic').height($('.pic').width());
                $('#picButton').css("margin-top", (h / 2 - 35.42 / 2));
            };

            $scope.initMap = function () {
                var munich = {lat: 48.1548895, lng: 11.4717965};
                var map = new google.maps.Map(document.getElementById('createMap'), {
                    zoom: 10,
                    center: munich
                });
                new AutocompleteDirectionsHandler(map);
            };
            function AutocompleteDirectionsHandler(map) {
                this.map = map;

                var originInput = document.getElementById('pickupLocation');
                var destinationInput = document.getElementById('deliverToLocation');

                this.directionsService = new google.maps.DirectionsService;
                this.directionsDisplay = new google.maps.DirectionsRenderer;
                this.directionsDisplay.setMap(map);

                this.originPlaceId = null;
                this.destinationPlaceId = null;

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
                        $scope.request.pickUpLocation = place.name;
                        me.originPlaceId = place.place_id;
                    } else {
                        $scope.request.deliverToLocation = place.name;
                        me.destinationPlaceId = place.place_id;
                    }
                    me.route();
                });

            };

            AutocompleteDirectionsHandler.prototype.route = function () {
                if (!this.originPlaceId || !this.destinationPlaceId) {
                    return;
                }
                var me = this;

                this.directionsService.route({
                    origin: {'placeId': this.originPlaceId},
                    destination: {'placeId': this.destinationPlaceId},
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        me.directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            };


            /**
             var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
             */


            initPicSize();
            $scope.initMap();
        }
    );