(function() {

    angular
        .module('lappweb')
        .service('ShopService', ['RESOURCE_API', 'MED_CODE', '$http', '$q', '$filter', function(RESOURCE_API, MED_CODE, $http, $q, $filter) {

            //$http.defaults.useXDomain = true;
            //delete $http.defaults.headers.common['X-Requested-With'];

            var service = {
                getCategories: getCategories,
                getSubCategory: getSubCategory
            };
            return service;

            function getCategories(id) {
                var deferred = $q.defer();
                $http.get(RESOURCE_API + 'api/catalog/category/' + id + "/" + MED_CODE)
                    .success(function(category) {
                        deferred.resolve(category);
                    })
                    .error(function(data, status, headers, config) {
                        // data is always undefined here when there is an error
                        console.error('Error fetching feed:', data);
                    });
                return deferred.promise;
            };

            function getSubCategory(id) {
                var deferred = $q.defer();
                $http.get(RESOURCE_API + 'api/catalog/subcategory/' + id + "/" + MED_CODE)
                    .success(function(subcategory) {
                        deferred.resolve(subcategory);
                    })
                    .error(function(data, status, headers, config) {
                        // data is always undefined here when there is an error
                        console.error('Error fetching feed:', data);
                    });
                return deferred.promise;
            };
        }]);
})();