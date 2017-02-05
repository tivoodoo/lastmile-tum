/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular
    .module('lastMile')
    .constant("BASEURL", "http://locahost:3000")
    .constant('BACKEND_BASE_URL', "http://localhost:4000")
    .constant('APP_NAME', "Full Trunk")


  angular
    .module('lastMile')

    .config(function ($urlRouterProvider, $mdIconProvider) {

      // redirect to startpage
      $urlRouterProvider
        .otherwise("/");
    })

})();
