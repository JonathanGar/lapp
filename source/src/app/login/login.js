(function() {
    'use strict';

    angular.module('lappweb')
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider

                .state('login', {
                    url: '/login/',
                    templateUrl: 'app/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'login'
                })
                .state('loginForm', {
                    url: '/loginForm/',
                    templateUrl: 'app/login/loginForm.html',
                    controller: 'LoginController',
                    controllerAs: 'login'
                })
        }]);

})();