(function() {

    angular
        .module('lappweb')
        .service('CartService', ['RESOURCE_API', '$http', '$q', '$filter', '$rootScope', 'toastr',
            function(RESOURCE_API, $http, $q, $filter, $rootScope, toastr) {

                var service = {
                    add: add,
                    remove: remove,
                    get: get,
                    addProductUnity: addProductUnity,
                    removeProductUnity: removeProductUnity
                };
                return service;

                function get() {
                    var deferred = $q.defer();
                    if ($rootScope.cart && $rootScope.cart.products) {
                        deferred.resolve($rootScope.cart.products);
                    } else {
                        deferred.reject(null);
                    }
                    return deferred.promise;
                };

                function add(product, quantity) {
                    product.quantityToAdd = quantity;

                    if (angular.isUndefined($rootScope.cart)) {
                        $rootScope.cart = {
                            products: []
                        };
                    }

                    var productExists = _.find($rootScope.cart.products, {
                        'id': product.id
                    });

                    if (productExists && productExists.quantityToAdd + product.quantityToAdd <= product.quantity) {
                        productExists.quantityToAdd += product.quantityToAdd;
                    } else if (!productExists) {
                        var productToAdd = angular.copy(product);
                        $rootScope.cart.products.push(productToAdd);
                    }
                    calculateSubTotal();
                    $rootScope.$emit('productAdded');
                };

                function remove(id) {
                    _.remove($rootScope.cart.products, {
                        'id': id
                    });

                    calculateSubTotal()
                };

                function calculateSubTotal() {
                    var priceToAdd = 0;
                    _.forEach($rootScope.cart.products, function(value) {
                        priceToAdd += (value.value * value.quantityToAdd);

                    });

                    $rootScope.cart.subTotal = priceToAdd;
                };

                function addProductUnity(product, quantity) {

                    if (quantity < product.quantity) {
                        quantity++;
                    } else {
                        toastr.info('No se pueden añadir más unidades de este producto', 'Información');
                    }

                    var productExists = _.find($rootScope.cart.products, {
                        'id': product.id
                    });

                    if (productExists && productExists.quantityToAdd + product.quantityToAdd <= product.quantity) {
                        productExists.quantityToAdd = quantity;
                        calculateSubTotal();
                    }

                    return quantity;
                };

                function removeProductUnity(product, quantity) {

                    if (quantity > 1) {
                        quantity--;
                    }
                    var productExists = _.find($rootScope.cart.products, {
                        'id': product.id
                    });

                    if (productExists && productExists.quantityToAdd + product.quantityToAdd <= product.quantity) {
                        productExists.quantityToAdd = quantity;
                        calculateSubTotal();
                    }
                    return quantity
                };
            }
        ]);
})();