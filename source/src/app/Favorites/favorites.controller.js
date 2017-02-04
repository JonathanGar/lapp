(function () {
  'use strict';

  angular
    .module('lappweb')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['CartService', '$rootScope', '$stateParams', 'FavoritesService', 'toastr'];

  /** @ngInject */
  function FavoritesController(CartService, $rootScope, $stateParams, FavoritesService, toastr) {

    angular.element(document.querySelector('.information-blocks')).css({
      'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
    });

    var vm = this;

    vm.removeFromCart = function (id) {
      CartService.remove(id);
    }

    vm.spinnerDown = function (product) {

      product.quantityToAdd = CartService.removeProductUnity(product, product.quantityToAdd);
    };

    vm.spinnerUp = function (product) {
      product.quantityToAdd = CartService.addProductUnity(product, product.quantityToAdd);
    };

    vm.addProduct = function (product) {
      toastr.success('Producto añadido al carrito', 'Información');
      CartService.add(product, 1);
      
    };

    vm.removeProduct = function (id) {
      toastr.success('Producto eliminado de mis favoritos', 'Información');
      FavoritesService.remove(id);
    };

  }
})();