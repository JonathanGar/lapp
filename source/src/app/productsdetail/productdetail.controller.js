(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('ProductDetailController', ProductDetailController);

    ProductDetailController.$inject = ['ProductService', 'CartService', '$rootScope', '$stateParams', 'toastr', 'FavoritesService'];

    /** @ngInject */
    function ProductDetailController(ProductService, CartService, $rootScope, $stateParams, toastr, FavoritesService) {

        /*angular.element(document.querySelector('.fixed-div')).css({
          'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
        });*/

        var vm = this;
        vm.quantity = 1;
        var settings = JSON.parse(localStorage.getItem('settings'));
        vm.policies = _.find(settings, {
            'key': 'Policies'
        }).value;

        vm.spinnerDown = function(product) {

            vm.quantity = CartService.removeProductUnity(product, vm.quantity);
        };

        vm.spinnerUp = function(product) {
            debugger;
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

                vm.product = result;
            });
        }





    }
})();