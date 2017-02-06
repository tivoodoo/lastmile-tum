/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  var SERVER_IP_ADDRESS = "192.168.2.115";

  angular
    .module('lastMile')
    .constant("BASEURL", "http://"+SERVER_IP_ADDRESS+":3000")
    .constant('BACKEND_BASE_URL', "http://"+SERVER_IP_ADDRESS+":4000")
    .constant('SERVER_IP_ADDRESS' , SERVER_IP_ADDRESS)
    .constant('APP_NAME', "Full Trunk")


  angular
    .module('lastMile')

    .config(function ($urlRouterProvider, $mdIconProvider) {

      // redirect to startpage
      $urlRouterProvider
        .otherwise("/");
    })

})();
