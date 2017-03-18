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

        function post(delivery, _products) {
            delivery.id = RegisterService.guid();
            //debugger;
            var products = [];
            angular.forEach(_products, function(product, key) {
                products.push({
                    "Subtotal": product.quantityToAdd * product.value,
                    "Discounts": 0,
                    "Quantity": product.quantityToAdd,
                    "DeliveryId": delivery.id,
                    "Product": null,
                    "ProductId": product.id,
                    "Price": null,
                    "PriceId": product.priceId,
                    "Promotion": product.promotion,
                    "PromotionId": null,
                    "id": RegisterService.guid(),
                    "createdAt": null,
                    "updatedAt": null,
                    "deleted": false
                });
            });
            //debugger;
            var data = {
                "DeliverySecondaryId": null,
                "ClientId": delivery.clientId,
                "Status": 1,
                "DeliveryDateTime": delivery.deliveryDateTime.toISOString(),
                "DeliveryCost": delivery.deliveryCost,
                "TotalDiscounts": 0,
                "Total": delivery.total,
                "SystemEffortPoints": delivery.EffortPoints,
                "EmployeeEffortPoints": 0,
                "AddressId": delivery.addressId,
                "Address": null,
                "Coupon": delivery.coupon,
                "Ratings": null,
                "Products": products,
                "Promotions": [],
                "EmployeeId": delivery.employeeId,
                "Employee": null,
                "SentAt": (new Date()).toISOString(),
                "id": delivery.id,
                "createdAt": null,
                "updatedAt": null,
                "deleted": false
            };
            //debugger;
            var deferred = $q.defer();
            $http.post(RESOURCE_API + '/api/deliveries', data)
                .success(function(res) {
                    //debugger;
                    deferred.resolve(res);
                })
                .error(function(data, status) {
                    //debugger;
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }

})();