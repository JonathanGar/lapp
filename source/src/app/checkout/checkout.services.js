(function() {

    angular
        .module('lappweb')
        .service('CheckoutService', CheckoutService);

    CheckoutService.$inject = ['RESOURCE_API', '$http', '$q', '$rootScope'];

    function CheckoutService(RESOURCE_API, $http, $q, $rootScope) {
        var service = {
            getCoupon: getCoupon,
            getServiceAvailability: getServiceAvailability
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
    }

})();