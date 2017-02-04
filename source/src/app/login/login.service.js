(function() {

    'use strict';

    angular
        .module('lappweb')
        .factory('LoginService', ["RESOURCE_API_TOKEN", "$http", LoginService]);

    function LoginService(RESOURCE_API_TOKEN, $http) {
        return {
            Login: function(username, password) {

                    return $http({
                        url: RESOURCE_API_TOKEN,
                        method: 'POST',
                        data: "userName=" + encodeURIComponent(username) +
                            "&password=" + encodeURIComponent(password) +
                            "&Scope=" + encodeURIComponent("website") +
                            "&grant_type=" + encodeURIComponent("client_credentials") +
                            "&client_secret=" + encodeURIComponent("123@abc") +
                            "&client_id=" + encodeURIComponent("ef4151a8-4809-4fdc-94c3-623dc45367f7"),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
                }
                /*
                    "userName=" + encodeURIComponent(username) +
                    "&password=" + encodeURIComponent(password) +
                    "&Scope=" + encodeURIComponent("website") +
                    "&grant_type=" + encodeURIComponent("client_credentials") +
                    "&client_secret=" + encodeURIComponent("123%40abc") +
                    "&client_id=" + encodeURIComponent("ef4151a8-4809-4fdc-94c3-623dc45367f7"),
                 
                {
                    "userName": username,
                    "password": password,
                    "Scope": "website",
                    "grant_type": "client_credentials",
                    "client_secret": "123@abc",
                    "client_id": "ef4151a8-4809-4fdc-94c3-623dc45367f7"
                }
                */
        }
    }

})();