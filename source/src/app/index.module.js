(function() {
    'use strict';

    angular
        .module('lappweb', [
            'ngAnimate',
            'ngCookies',
            'ngTouch',
            'ngSanitize',
            'ngMessages',
            'ngAria',
            'ngResource',
            'ui.router',
            'satellizer',
            'ui.bootstrap',
            'toastr',
            'ksSwiper',
            'cgBusy'
        ])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$authProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $authProvider) {
            $urlRouterProvider
                .otherwise('/login');

            $locationProvider.html5Mode(true);

            //CORS
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $httpProvider.defaults.headers.common['ZUMO-API-VERSION'] = '2.0.0'; // add the application key
            $httpProvider.interceptors.push('httpRequestInterceptor');
            //$httpProvider.defaults.headers.common['X-ZUMO-APPLICATION'] = 'myapplicationkey'; // add the application key
            //$httpProvider.defaults.headers.common['Content-Type'] = 'Application/json';
            $authProvider.facebook({
                clientId: '962347967217066',
                responseType: 'token'
            });

            $authProvider.google({
                clientId: '395438047856-0fc3eejasd3lfibv63039e14uhd6a3ob.apps.googleusercontent.com'
            });
            //$authProvider.loginUrl = "http://lapptienda-api-dev.azurewebsites.net/token";
        }
    ])

    .factory('httpRequestInterceptor', ["$cookies", "$rootScope", "$q", "$injector", "$location", function($cookies, $rootScope, $q, $injector, $location) {
        return {
            request: function(config) {
                //config.headers.Authorization = 'ZUMO-API-VERSION 2.0.0'; NO
                //config.headers["ZUMO-API-VERSION"] = "2.0.0";
                //return config;
                config.headers = config.headers || {};
                if ($rootScope.globals) {
                    if ($rootScope.globals.accessToken) {
                        config.headers.Authorization = 'Bearer ' + $rootScope.globals.accessToken;
                    }
                }
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },
            /*requestError: function(rejection) {
                debugger;
                return rejection;
            },*/
            responseError: function(response) {
                //debugger;
                // error - was it 401 or something else?
                if (response.status === 401) {
                    var deferred = $q.defer(); // defer until we can re-request a new token
                    var accessToken = window.localStorage.getItem("accessToken");
                    var refreshtoken = window.localStorage.getItem("refreshToken");
                    // Get a new token... (cannot inject $http directly as will cause a circular ref)
                    /*$injector.get("authenticationService").RefreshToken(refreshtoken).then(function(loginResponse) {
                        if (loginResponse) {
                            console.log(loginResponse);
                            $rootScope.globals.accessToken = loginResponse.data.access_token; // we have a new acces token - set at $rootScope
                            $rootScope.globals.refreshToken = loginResponse.data.refresh_token; // we have a new refresh token - set at $rootScope
                            //Update the headers
                            window.localStorage.setItem("accessToken", loginResponse.data.access_token);
                            window.localStorage.setItem("refreshToken", loginResponse.data.refresh_token);
                            window.localStorage.setItem("rememberMe", true);
                            //Time Expires
                            window.localStorage.setItem("time_expires_in", loginResponse.data.expires_in);
                            //Time user logged in
                            window.localStorage.setItem("time_logged_in", new Date().getTime());

                            // now let's retry the original request - transformRequest in .run() below will add the new OAuth token
                            $injector.get("authenticationService").ResolveDeferred(response.config).then(function(defResp) {
                                // we have a successful response - resolve it using deferred
                                deferred.resolve(defResp);
                            }, function(defResp) {
                                deferred.reject(); // something went wrong
                            });
                        } else {
                            deferred.reject(); // login.json didn't give us data
                        }
                    }, function(response) {
                        deferred.reject(); // token retry failed, redirect so user can login again
                        $location.path('/login');
                        return;
                    });*/
                    deferred.resolve(response); //TODO:quitar
                    return deferred.promise; // return the deferred promise
                }
                return $q.reject(response); // not a recoverable error
            }
        };
    }]);

})();