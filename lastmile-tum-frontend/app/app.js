/**
 * Created by DanielSchlingmann on 29.11.16.
 */

//TODO: Truncate module app in smaller modules
var app = angular.module('lastMile', [
    'ngRoute',
    'ui.bootstrap',
    'ngMaterial',
    'ui.router',
    'ngResource'

]);

// app.constant("BASEURL", "http://localhost:3000");

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/', {
            templateUrl: './components/landingPage/start.html'
        })
        .when('/browse', {
            templateUrl: './components/browseRequests/browse.html'
        })
        .when('/create', {
            templateUrl: './components/createRequest/create.html'
        })
        .when('/my', {
            templateUrl: './components/myRequests/myRequests.html'
        })
        .otherwise({redirectTo: '/'});
}]);

