/**
 * Created by DucTien on 14.12.2016.
 */

(function () {
  'use strict';

  angular.module('lastMile')
    .factory("authInterceptor", authInterceptor);

  function authInterceptor(BACKEND_BASE_URL, auth) {

    function req(config) {
      // automatically attach Authorization header
      if (config.url.indexOf(BACKEND_BASE_URL) === 0 && auth.isAuthed()) {
        var token = auth.getToken();
        config.headers.Authorization = 'JWT ' + token;
      }

      return config;

    }

    function res(res) {

      // If a token was sent back, save it
      if (res && res.config.url.indexOf(BACKEND_BASE_URL) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      }

      return res;

    }

    return {
      request: req,
      response: res
    };
  }
})();