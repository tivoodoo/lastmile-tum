/**
 * Created by TimH on 06-Jan-17.
 */
angular.module('lastMile')
    .controller('browseDetailModalController', function ($scope, $uibModalInstance, selectedReq) {
        $scope.selectedReq = selectedReq;


        var showDetailsModal = function (){
            var munich = {lat: 48.1493505, lng: 11.567825500000026};
            var dresden = {lat: 51.03569479999999, lng: 13.718207099999972};

            var map2 = new google.maps.Map(document.getElementById('modalMap'), {
            });

            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map2
            });

            // Set destination, origin and travel mode.
            var request = {
                destination: dresden,
                origin: munich,
                travelMode: 'DRIVING'
            };

            // Pass the directions request to the directions service.
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    // Display the route on the map.
                    directionsDisplay.setDirections(response);
                }
            });
        };

        var setHeightModalMap = function (){
            var modalBodyHeight = $('#showDetails .modal-body').height();
            var firstRowHeight = 150;
            var vrHeight = 43;
            var mapHeight = modalBodyHeight - firstRowHeight - vrHeight;
            $('#modalMap').height(mapHeight + "px");

        };

        var setHeightChatWindow = function (){
            var modalMapHeight = $('#modalMap').height();
            var aboveTableHeight = 21 + 15 + 2;
            var buttonHeight = 35;
            var inputHeight = 50 + 15;
            var chatHeight = modalMapHeight - aboveTableHeight - buttonHeight - inputHeight;
            $('#tableDiv').height(chatHeight + "px");
        };
        //showDetailsModal();
        setHeightModalMap();
        setHeightChatWindow();


        $scope.accept = function () {
            //process accept
            $uibModalInstance.close('accept');
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });