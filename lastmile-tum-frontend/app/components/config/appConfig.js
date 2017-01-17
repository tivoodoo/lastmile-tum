/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular
    .module('lastMile')
    .constant("BASEURL", "http://localhost:3000")
    .constant('BACKEND_BASE_URL', "http://localhost:4000")
    .constant('APP_NAME', "Last Mile")

  angular
    .module('lastMile')

    .config(function ($urlRouterProvider, $mdIconProvider) {

      // redirect to startpage
      $urlRouterProvider
        .otherwise("/");
    })

})();
