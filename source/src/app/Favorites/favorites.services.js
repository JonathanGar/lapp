(function () {

    angular
        .module('lappweb')
        .service('FavoritesService', ['RESOURCE_API', '$http', '$q', '$filter', '$rootScope', function (RESOURCE_API, $http, $q, $filter, $rootScope) {

            var service = {
                add: add,
                remove: remove,
                get: get
            };
            return service;

            function get() {
                $rootScope.favorites.products =[];
                $rootScope.favorites.products.push(JSON.parse(localStorage.favorites));
                return $rootScope.favorites.products;
            }

            function add(product) {
                
                if (angular.isUndefined(sessionStorage.favorites)) {
                    localStorage.favorites = [];
                }

                var productExists = _.find(localStorage.favorites, {
                    'id': product.id
                });

                if (!productExists) {
                    var productToAdd = angular.copy(product);
                    $rootScope.favorites.products.push(productToAdd);
                    localStorage.favorites = JSON.stringify($rootScope.favorites.products);
                    
                }

                $rootScope.$emit('favoriteAdded');
            }

            function remove(id) {
                
                _.remove($rootScope.favorites.products, {
                    'id': id
                });

                localStorage.favorites = JSON.stringify($rootScope.favorites.products);

            }
        }]);
})();