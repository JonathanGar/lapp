(function() {

    angular
        .module('lappweb')
        .service('CheckoutService', CheckoutService);

    CheckoutService.$inject = ['RESOURCE_API', '$http', '$q', '$rootScope', 'RegisterService'];

    function CheckoutService(RESOURCE_API, $http, $q, $rootScope, RegisterService) {
        var service = {
            getCoupon: getCoupon,
            getServiceAvailability: getServiceAvailability,
            post: post
        };
        return service;

        function getCoupon(coupon) {
            var deferred = $q.defer();
            $http.get(RESOURCE_API + '/api/promotions/coupon/' + encodeURIComponent(coupon))
                .success(function(res) {
                    deferred.resolve(res);
                })
                .error(function(data, status) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        function getServiceAvailability() {
            var deferred = $q.defer();
            $http.get(RESOURCE_API + '/tables/ServiceAvailability')
                .success(function(res) {
                    deferred.resolve(res);
                })
                .error(function(data, status) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        function post(delivery) {
            delivery.id = RegisterService.guid();
            debugger;
            var deferred = $q.defer();
            $http.post(RESOURCE_API + '/api/deliveries', delivery)
                .success(function(res) {
                    debugger;
                    deferred.resolve(res);
                })
                .error(function(data, status) {
                    debugger;
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }

})();