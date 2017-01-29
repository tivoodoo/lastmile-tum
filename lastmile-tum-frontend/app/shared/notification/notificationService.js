/**
 * Created by TimH on 29-Jan-17.
 */

(function () {
    'use strict';
    angular.module('lastMile')
        .factory('Notification', function ($resource, BACKEND_BASE_URL) {
            //API von Angular : https://docs.angularjs.org/api/ngResource/service/$resource
            return $resource(BACKEND_BASE_URL + '/notification/:notificationID', {notificationID: '@_id'});

        });
})();