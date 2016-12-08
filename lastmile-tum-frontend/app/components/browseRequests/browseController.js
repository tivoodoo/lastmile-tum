angular.module('lastMile')
    .controller('BrowseCtrl', ['$scope',
        function ($scope) {
            $scope.initMap = initMap;

            function initMap() {
                var munich = {lat: 48.1548895, lng: 11.4717965};
                var map = new google.maps.Map(document.getElementById('browsemap'), {
                    zoom: 10,
                    center: munich
                });
                /**
                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
                 */
            }

            $scope.initMap();
        }
    ]);

