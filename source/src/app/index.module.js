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
            'cgBusy',
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
                config.headers = config.headers || {};
                if ($rootScope.globals) {
                    if ($rootScope.globals.accessToken) {
                        config.headers.Authorization = 'Bearer ' + $rootScope.globals.accessToken;
                    }
                }
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },
            responseError: function(rejection) {
                //debugger;
                // error - was it 401 or something else?
                if (rejection.status === 401) {
                    var deferred = $q.defer(); // defer until we can re-request a new token
                    var authService = $injector.get('AuthFactory');
                    //var accessToken = window.localStorage.getItem("accessToken");
                    //var refreshtoken = window.localStorage.getItem("refreshToken");                    
                    //var authData = localStorageService.get('authorizationData');

                    try {
                        var authData = $rootScope.globals.authorizationData;
                    } catch (err) {

                    }

                    if (authData) {
                        if (authData.useRefreshTokens) {
                            $location.path('/refresh');
                            return $q.reject(rejection);
                        }
                    }
                    authService.logout();
                    $location.path('/login');
                    //deferred.resolve(rejection); //TODO:quitar
                    //return deferred.promise; // return the deferred promise
                }
                return $q.reject(rejection); // not a recoverable error
            }
        };
    }]);

})();