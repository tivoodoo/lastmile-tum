angular.module('lastMile')
    .controller('BrowseCtrl', ['$scope',
        function ($scope) {
            $scope.filterShowed = false;

            $scope.initMap = initMap;
            $scope.clearInput = clearInput;
            $scope.showDetailsModal = showDetailsModal;

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
            };

            function clearInput(){
                $scope.fromCity = '';
                $scope.toCity = '';
                $scope.pickup = '';
                $scope.dropoff = '';
                $scope.size = 'XL';
                $scope.lowPrice = '';
                $scope.highPrice = '';

                $scope.filterShowed = false;
            };

            function showDetailsModal(){
                var munich = {lat: 48.1548895, lng: 11.4717965};
                var map = new google.maps.Map(document.getElementById('modalMap'), {
                    zoom: 10,
                    center: munich
                });
                setHeightModalMap();
            };

            var setHeightModalMap = function (){
                var modalBodyHeight = $('#showDetails .modal-dialog .modal-body').height();
                var firstRowHeight = 150;
                var vrHeight = 43;
                var mapHeight = modalBodyHeight - firstRowHeight - vrHeight;
                console.log(mapHeight);
                $('#modalMap').height(mapHeight + "px");
            };

            $scope.initMap();
        }
    ])
    .directive('datepicker', function () {
        return {
            require : 'ngModel',
            link : function (scope, element, attrs, ngModelCtrl) {
                $(function(){
                    element.datepicker({
                        dateFormat:'dd.mm.yy',
                        onSelect:function (dateText, inst) {
                            ngModelCtrl.$setViewValue(dateText);
                            scope.$apply();
                        }
                    });
                });
            }
        }
    });

//datepicker: https://www.grobmeier.de/angular-js-binding-to-jquery-ui-datepicker-example-07092012.html
//datepicker: http://jsfiddle.net/xB6c2/121/