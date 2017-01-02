angular.module('lastMile')
    .controller('CreateCtrl',
        function ($scope, Request, userService) {
            $scope.request = new Request();


            $scope.postRequest = function () {
                alert("clicked");
                $scope.request.requester = userService.getUserName()._id;
                $scope.request.$save()
                    .then(function (res) {
                        alert("request posted successfully");
                    })
                    .catch(function (err) {
                        alert(err);
                    })
            }

            $scope.initMap = initMap;

            var initPicSize = function () {
                var h = $('.pic').height($('.pic').width());
                $('#picButton').css("margin-top", (h / 2 - 35.42 / 2));
            };

            function initMap() {
                var munich = {lat: 48.1548895, lng: 11.4717965};
                var map = new google.maps.Map(document.getElementById('createMap'), {
                    zoom: 10,
                    center: munich
                });
                /**
                 var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
                 */
            };

            initPicSize();
            $scope.initMap();
        }
);