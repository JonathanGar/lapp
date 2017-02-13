(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('ShopCategoriesController', ShopCategoriesController);

    ShopCategoriesController.$inject = ['FavoritesService', 'ShopService', 'CartService', '$rootScope', '$stateParams', 'PagerService', 'toastr', 'MainService'];

    /** @ngInject */
    function ShopCategoriesController(FavoritesService, ShopService, CartService, $rootScope, $stateParams, PagerService, toastr, MainService) {
        var vm = this;

        vm.pageSize = 12;
        vm.totalProducts = 0;
        vm.totalPages = 0;
        vm.pager = {};

        vm.events = {
            /*getCategory: function(id) {                
                ShopService.getCategories(id).then(function(data) {
                    if (data.length > 0) {
                        vm.category = data[0].products;
                    }
                });
            },*/
            getSubCategory: function(id) {
                ShopService.getSubCategory(id).then(function(data) {
                    if (data.length > 0) {
                        vm.catalogsProducts = data[0].products;
                    }
                });
            }
        };

        if ($stateParams.id) {
            ShopService.getCategories($stateParams.id).then(function(catalogs) {
                vm.catalogName = JSON.parse(localStorage.getItem("catalogsDict"))[$stateParams.id];
                vm.catalogs = catalogs;
                vm.catalogsProducts = [];
                //vm.events.getCategory($stateParams.id);
                _(vm.catalogs).forEach(function(catalog) {
                    vm.catalogsProducts = vm.catalogsProducts.concat(catalog.products);
                    if (angular.isDefined(vm.catalogsProducts)) {
                        vm.totalProducts = vm.catalogsProducts.length;
                        vm.totalPages = Math.ceil(vm.totalProducts / vm.pageSize);
                        vm.setPage(1);
                    }
                });
            });
        }


        vm.quantity = 1;
        var settings = JSON.parse(localStorage.getItem('settings'));
        if (settings.length === 0) {
            MainService.getSettings().then(function(settings) {
                debugger;
                vm.policies = _.find(settings, {
                    'key': 'Policies'
                }).value;
            });
        } else {
            vm.policies = _.find(settings, {
                'key': 'Policies'
            }).value;
        }

        vm.spinnerDown = function() {
            if (vm.quantity > 1) {
                vm.quantity--;
            }
        };

        vm.spinnerUp = function() {
            if (vm.quantity < vm.productDetail.quantity) {
                vm.quantity++;
            }
        };

        /*vm.AddProduct = function(product, quantity) {
            product.quantityToAdd = quantity;
            $rootScope.$emit('productAdded', product);            
        };*/
        vm.AddProduct = function(product) {
            CartService.add(product, 1);
            toastr.success('Producto añadido al carrito', 'Información');
        };

        vm.AddFavorite = function(product) {
            FavoritesService.add(product);
            toastr.success('Producto añadido a favoritos', 'Información');
        };

        vm.setPage = function(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = PagerService.GetPager(vm.catalogsProducts.length, page);

            // get current page of items
            vm.items = vm.catalogsProducts.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        };
    }
})();