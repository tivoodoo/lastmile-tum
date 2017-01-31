/**
 * Created by Daniel on 30.01.2017.
 */
angular.module('lastMile')
    .controller('notificationModalController', function ($scope) {
        $scope.body = 'Put here your body';
        $scope.footer = 'Put here your footer';
    })
    .directive('modal', function () {
        return {
            restrict: 'EA',
            scope: {
                title: '=modalTitle',
                header: '=modalHeader',
                body: '=modalBody',
                handler: '=notificationModal'
            },
            templateUrl: './notificationModal/notificationModal.html',
            transclude: true,
            controller: function ($scope) {
                $scope.handler = 'pop';
            },
        };
    });