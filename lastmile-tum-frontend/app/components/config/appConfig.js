/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular
    .module('lastMile')
    .constant("BASEURL", "http://192.168.0.14:3000")
    .constant('BACKEND_BASE_URL', "http://192.168.0.14:4000")
    .constant('APP_NAME', "Full Trunk")


  angular
    .module('lastMile')

    .config(function ($urlRouterProvider, $mdIconProvider) {

      // redirect to startpage
      $urlRouterProvider
        .otherwise("/");
    })

})();
