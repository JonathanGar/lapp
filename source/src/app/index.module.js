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
            'mwl.confirm',
            'ui.router',
            'satellizer',
            'ui.bootstrap',
            'toastr',
            'ksSwiper'
            //,'720kb.datepicker'
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
                var authorizationData = $cookies.getObject("authorizationData");
                if (authorizationData && authorizationData.token) {
                    config.headers.Authorization = 'Bearer ' + authorizationData.token;
                }

                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },
            responseError: function(rejection) {
                //debugger;
                // error - was it 401 or something else?

                var deferred = $q.defer(); // defer until we can re-request a new token 
                if (rejection.status === 401) {
                    $location.path('/');
                    //var authData = localStorageService.get('authorizationData');
                    /*var authService = $injector.get('AuthFactory');

                    try {
                        authService.obtainAccessToken().then(function(data) {
                            debugger;
                            $cookies.getObject("authorizationData").token = data.access_token;
                            rejection.config.headers.Authorization = 'Bearer ' + data.access_token;
                            return $q.reject(rejection);
                        }, function(err) {
                            $location.path('/');
                        });

                    } catch (err) {
                        $location.path('/');
                    }

                    return $q.reject(rejection);
                    if (authData) {
                        if (authData.useRefreshTokens) {
                            $location.path('/');
                            return $q.reject(rejection);
                        }
                    }*/
                    //authService.logout();
                    //$location.path('/login');
                }
                return $q.reject(rejection); // not a recoverable error
            }
        };
    }]);

})();