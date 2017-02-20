(function() {

    'use strict';

    angular
        .module('lappweb')
        .factory('LoginService', ["$q", "$http", "AuthFactory", LoginService]);

    function LoginService($q, $http, AuthFactory) {
        return {
            Login: function(_username, _password) {
                var loginData = { userName: _username, password: _password, useRefreshTokens: true },
                    deferred = $q.defer();
                AuthFactory.login(loginData).then(function(data) {                        
                        deferred.resolve(data);
                    },
                    function(err) {                        
                        deferred.reject(err);
                    });
                return deferred.promise;
            }
        }
    }

})();