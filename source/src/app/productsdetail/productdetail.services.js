(function() {

    angular
        .module('lappweb')
        .service('ProductService', ['RESOURCE_API', 'RESOURCE_API_TEMP', 'MED_CODE', '$http', '$q', '$filter', function(RESOURCE_API, RESOURCE_API_TEMP, MED_CODE, $http, $q, $filter) {

            var service = {
                get: get,
                post: post,
                put: put,
                drop: drop,
                getDetail: getDetail
            };
            return service;

            function get() {
                var deferred = $q.defer();
                //$http.get('https://lapptienda-api-dev.azurewebsites.net/tables/products')
                $http.get('./assets/data/products.json')
                    .success(function(products) {
                        deferred.resolve(products);
                    })
                    .error(function(data, status, headers, config) {
                        // data is always undefined here when there is an error
                        console.error('Error fetching feed:', data);
                    });
                return deferred.promise;
            }

            function post(data) {
                var deferred = $q.defer();
                $http.post('/api/v1/planning/maintenance', data).success(function(evt) {
                    deferred.resolve(evt);
                });
                return deferred.promise;
            }

            function put(id) {
                var deferred = $q.defer();
                $http.put('/api/v1/planning/maintenance/:id', {
                    id: id
                }).success(function(evt) {
                    deferred.resolve(evt);
                });
                return deferred.promise;
            }

            function drop(id) {
                var deferred = $q.defer();
                $http.delete('/api/v1/planning/maintenance/:id', {
                    id: id
                }).success(function(data) {
                    deferred.resolve(evt);
                });
                return deferred.promise;
            }

            function getDetail(id) {
                var deferred = $q.defer();
                $http.get(RESOURCE_API + 'api/catalog/' + MED_CODE)
                    //$http.get('./assets/data/catalogs.json')
                    .success(function(product) {
                        deferred.resolve(product);
                    })
                    .error(function(data, status, headers, config) {
                        // data is always undefined here when there is an error
                        console.error('Error fetching feed:', data);
                    });
                return deferred.promise;
            }


        }]);
})();