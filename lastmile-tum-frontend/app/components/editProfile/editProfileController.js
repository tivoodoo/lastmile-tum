angular.module('lastMile')
    .controller('EditCtrl', ['$scope',
        function($scope) {
            var initPicSize = function(){
                $('.pic').height($('.pic').width());
            };

            initPicSize();
        }
    ]);