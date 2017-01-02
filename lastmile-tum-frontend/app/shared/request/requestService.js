/**
 * Created by TimH on 02-Jan-17.
 */

(function () {
    'use strict';
    angular.module('lastMile')
        .factory('Request', function ($resource, BACKEND_BASE_URL) {
            //API von Angular : https://docs.angularjs.org/api/ngResource/service/$resource
            return $resource(BACKEND_BASE_URL + '/requests/:request_id', {request_id: '@_id'});

        });
})();