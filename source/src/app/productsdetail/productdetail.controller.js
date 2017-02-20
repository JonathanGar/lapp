(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('ProductDetailController', ProductDetailController);

    ProductDetailController.$inject = ['ProductService', 'CartService', '$rootScope', '$stateParams', 'toastr', 'FavoritesService', 'MainService'];

    /** @ngInject */
    function ProductDetailController(ProductService, CartService, $rootScope, $stateParams, toastr, FavoritesService, MainService) {

        /*angular.element(document.querySelector('.fixed-div')).css({
          'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
        });*/

        var vm = this;
        vm.quantity = 1;
        var settings = JSON.parse(localStorage.getItem('settings'));

        if (settings.length === 0) {
            MainService.getSettings().then(function(settings) {
                vm.policies = _.find(settings, {
                    'key': 'Policies'
                }).value;
            });
        } else {
            vm.policies = _.find(settings, {
                'key': 'Policies'
            }).value;
        }

        vm.spinnerDown = function(product) {

            vm.quantity = CartService.removeProductUnity(product, vm.quantity);
        };

        vm.spinnerUp = function(product) {
            //vm.quantity = CartService.addProductUnity(product, 1);
            vm.quantity = CartService.addProductUnity(product, vm.quantity);
        };

        vm.AddProduct = function(product, quantity) {
            vm.quantity = 1;
            CartService.add(product, quantity);
            toastr.success('Producto añadido al carrito', 'Información');
        };

        vm.AddFavorite = function(product) {
            FavoritesService.add(product);
            toastr.success('Producto añadido a favoritos', 'Información');
        };

        if ($stateParams.id) {
            ProductService.getDetail($stateParams.id).then(function(resp) {
                var result;
                var b = angular.forEach(resp, function(value, key) {
                    angular.forEach(value.products, function(element) {
                        if (element.id === $stateParams.id) {
                            result = element;
                        }
                    });
                });

                if (result) {
                    vm.product = result;
                } else {
                    vm.nodispo = true;
                    ProductService.get().then(function(data) {
                        debugger;
                        //vm.products = data;
                        vm.product = _.find(data, {
                            'id': $stateParams.id
                        });
                    }).catch(function(err) {});
                }
            });
        }
    }
})();