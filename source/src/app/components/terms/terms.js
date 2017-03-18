(function() {
    'use strict';

    angular.module('lappweb')
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider
                .state('terms', {
                    url: '/politicas',
                    templateUrl: 'app/components/terms/terms.html',
                    //controller: 'OrdersController',
                    //controllerAs: 'favorites',
                    authenticate: true
                })
        }]);

})();