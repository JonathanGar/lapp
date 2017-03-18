(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('MainController', MainController);

    MainController.$inject = ['$window', 'MainService', 'CartService', 'FavoritesService', '$rootScope', 'toastr', 'AuthFactory'];

    /** @ngInject */
    function MainController($window, MainService, CartService, FavoritesService, $rootScope, toastr, AuthFactory) {
        var vm = this;
        $window.scrollTo(0, 0);
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


        if (localStorage.getItem("settings") === "[]") {
            MainService.getSettings().then(function(settings) {});
        }

        angular.element(document.querySelector('.fixed-header-margin')).css({
            'padding-top': angular.element(document.querySelector('header')).outerHeight(true)
        });

        AuthFactory.obtainAccessToken().then(function(resp) {
            vm.myPromise = MainService.catalogs().then(function(resp) {
                var catalogsDict = {};
                _.forEach(resp, function(value) {
                    catalogsDict[value.id] = value.name;
                });
                localStorage.setItem("catalogsDict", JSON.stringify(catalogsDict));
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