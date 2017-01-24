/**
 * Created by DanielSchlingmann on 24.01.17.
 */

(function () {
    'use strict';
    angular.module('lastMile')
        .factory('Rating', function ($resource, BACKEND_BASE_URL) {
            //API von Angular : https://docs.angularjs.org/api/ngResource/service/$resource
            return $resource(BACKEND_BASE_URL + '/rating/:ratingID', {ratingID: '@_id'});

        });
})();