(function() {
  'use strict';

  angular
    .module('lappweb')
    .controller('CartDetailController', CartDetailController);

  CartDetailController.$inject = ['CartService', '$rootScope', '$stateParams'];

  /** @ngInject */
  function CartDetailController(CartService, $rootScope, $stateParams) {

    angular.element(document.querySelector('.information-blocks')).css({
      'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
    });

    var vm = this;

    vm.removeFromCart = function(id) {
      CartService.remove(id);
    }

    vm.spinnerDown = function(product) {

      product.quantityToAdd = CartService.removeProductUnity(product,product.quantityToAdd);
    };

    vm.spinnerUp = function(product) {
      product.quantityToAdd = CartService.addProductUnity(product, product.quantityToAdd);
    };

  }
})();