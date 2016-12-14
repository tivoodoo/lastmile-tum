angular.module('lastMile')
    .directive('lmHeader', function () {
        return {
            restrict: 'E',
            scope: {
                text: '@',
                img: '@'
            },
            templateUrl: './shared/header/lm-header.html'
        }
    });