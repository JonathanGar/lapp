(function() {

    'use strict';

    angular
        .module('lappweb')
        .factory('OrdersService', OrdersService);
    OrdersService.$inject = ['RESOURCE_API', 'MED_CODE', '$http', '$q', '$log'];

    function OrdersService(RESOURCE_API, MED_CODE, $http, $q, $log) {
        return {
            orders: orders,
            order: order
        };

        function orders() {
            var deferred = $q.defer();
            $http.get(RESOURCE_API + "tables/Deliveries")
                .success(function(orders) {
                    deferred.resolve(orders);
                })
                .error(function(data, status, headers, config) {
                    $log.error('Error fetching feed:', data);
                });
            return deferred.promise;
        };

        function order(id) {
            var deferred = $q.defer();
            $http.get(RESOURCE_API + "api/deliveries/" + id)
                .success(function(order) {
                    deferred.resolve(order);
                })
                .error(function(data, status, headers, config) {
                    $log.error('Error fetching feed:', data);
                });
            return deferred.promise;
        };
    }

})();