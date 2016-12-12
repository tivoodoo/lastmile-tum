/**
 * Created by TimHenkelmann on 11.12.16.
 */
/*(function(){

    angular.module('myApp')
        .service('currUser', currUserService);

    function currUserService(BASEURL, $http, auth, $state) {

        this.register = register;
        this.login = login;
        this.loggedIn = auth.isAuthed;
        this.logout = auth.deleteToken;
        this.getUser = getUser;


        ////////////////

        function register(user, pass, first, last, em) {
            return $http.post(BASEURL + '/signup', {
                username: user,
                password: pass,
                firstName: first,
                lastName: last,
                email: em
            });
        }

        function login(user, pass) {
            return $http.post(BASEURL + '/login', {
                username: user,
                password: pass
            })
                .success(function(response) {
                    $state.go('buyingoffers.list');
                });
        }

        function getUser() {
            var token = auth.getToken();
            return token? auth.parseJwt(token).user : {};
        }
    }

})();*/