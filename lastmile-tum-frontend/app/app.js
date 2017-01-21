/**
 * Created by DanielSchlingmann on 29.11.16.
 */

//TODO: Truncate module app in smaller modules
var app = angular.module('lastMile', [
  'ngRoute',
  'ui.bootstrap',
  'ngMaterial',
  'ui.router',
  'ngResource',
  'ngFileUpload'

]);

// app.constant("BASEURL", "http://localhost:3000");

app.config(function ($routeProvider, $locationProvider, $resourceProvider, $httpProvider) {
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  $routeProvider
    .when('/', {
      templateUrl: './components/landingPage/start.html'
    })
    .when('/browse', {
      templateUrl: './components/browseRequests/browse.html'
    })
    .when('/detail', {
      templateUrl: './components/browseRequests/reqDetail.html'
    })
    .when('/create', {
      templateUrl: './components/createRequest/create.html'
    })
    .when('/myReq', {
      templateUrl: './components/myRequests/myRequests.html'
    })
    .when('/myDel', {
      templateUrl: './components/myDeliveries/myDeliveries.html'
    })
    .when('/editPro', {
      templateUrl: './components/editProfile/editProfile.html'
    })
    .when('/editReq', {
      templateUrl: './components/editRequest/editRequest.html'
    })
    .otherwise({redirectTo: '/'});

  //auth interceptor
  $httpProvider.interceptors.push('authInterceptor');

  angular.extend($resourceProvider.defaults.actions, {

    update: {
      method: "PUT"
    }

  });
});

