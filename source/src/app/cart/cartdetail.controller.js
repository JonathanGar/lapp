(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('CartDetailController', CartDetailController);

    CartDetailController.$inject = ['CartService', '$rootScope', '$stateParams', '$window'];

    /** @ngInject */
    function CartDetailController(CartService, $rootScope, $stateParams, $window) {

        $window.scrollTo(0, 0);

        angular.element(document.querySelector('.information-blocks')).css({
            'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
        });

        var vm = this;

        vm.removeFromCart = function(id) {
            CartService.remove(id);
        }

        vm.spinnerDown = function(product) {

            product.quantityToAdd = CartService.removeProductUnity(product, product.quantityToAdd);
        };

        vm.spinnerUp = function(product) {
            product.quantityToAdd = CartService.addProductUnity(product, product.quantityToAdd);
        };

    }
})();