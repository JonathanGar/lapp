(function() {
    'use strict';

    angular.module('lappweb')
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider

                .state('orders', {
                url: '/orders',
                templateUrl: 'app/orders/orders.html',
                controller: 'OrdersController',
                controllerAs: 'orders',
                authenticate: true
            })

            .state('order-detail', {
                url: '/order/:id',
                templateUrl: 'app/orders/order-detail.html',
                controller: 'OrdersController',
                controllerAs: 'order',
                authenticate: true
            })
        }]);

})();