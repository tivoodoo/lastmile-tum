/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
    'use strict';

    angular.module('lastMile')
        .service('userService', userService)
        .factory('User', function ($resource, BACKEND_BASE_URL) {
            //API von Angular : https://docs.angularjs.org/api/ngResource/service/$resource
            return $resource(BACKEND_BASE_URL + '/user/:userID', {userID: '@_id'});

        });

    function userService(BACKEND_BASE_URL, $http, auth, User) {

        this.register = register;
        this.login = login;
        this.getUser = getUser;
        this.getUserName = getUserName;
        this.loggedIn = auth.isAuthed;
        this.logout = auth.deleteToken;

        ////////////////

        function register(user) {
            return $http.post(BACKEND_BASE_URL + '/user/signup', user);
        }

        function login(mail, pass) {
            return $http.post(BACKEND_BASE_URL + '/user/login', {
                email: mail,
                password: pass
            });
        }

        function getUserName() {
            var token = auth.getToken();
            return token ? auth.parseJwt(token).user : {};
        }

        function getUser() {
            var token = auth.getToken();
            var userID = auth.parseJwt(token).user._id;
            return User.get({userID: userID});
        }
    }

})();
