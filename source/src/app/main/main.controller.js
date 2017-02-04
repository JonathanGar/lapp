(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('MainController', MainController);

    MainController.$inject = ['MainService', 'CartService', 'FavoritesService', '$rootScope', 'toastr'];

    /** @ngInject */
    function MainController(MainService, CartService, FavoritesService, $rootScope, toastr) {
        var vm = this;

        if (angular.isUndefined($rootScope.cart)) {
            $rootScope.cart = {
                products: []
            }
        }

        if (angular.isUndefined($rootScope.favorites)) {
            $rootScope.favorites = {
                products: []
            }

            $rootScope.favorites.products = FavoritesService.get();
        }


        if (localStorage.getItem("settings") === null) {
            MainService.getSettings();
        }

        angular.element(document.querySelector('.fixed-header-margin')).css({
            'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
        });

        MainService.obtainAccessToken().then(function(resp) {
            vm.myPromise = MainService.catalogs().then(function(resp) {
                vm.catalogs = resp;
            });
        }).catch(function(err) {
            debugger;
        });

        vm.AddProduct = function(product) {
            CartService.add(product, 1);
            toastr.success('Producto añadido al carrito', 'Información');
        };

        vm.AddFavorite = function(product) {
            FavoritesService.add(product);
            toastr.success('Producto añadido a favoritos', 'Información');
        };

    }
})();