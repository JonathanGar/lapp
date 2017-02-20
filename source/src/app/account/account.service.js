(function() {

    angular
        .module('lappweb')
        .service('AccountService', ['RESOURCE_API', 'RESOURCE_API_TEMP', '$http', '$q', 'toastr', function(RESOURCE_API, RESOURCE_API_TEMP, $http, $q, toastr) {

            return service = {
                post: post
            };

            function post(itemSave) {
                var deferred = $q.defer();
                
                $http.post(RESOURCE_API + "tables/Addresses", itemSave)
                .success(function(res) {
                    deferred.resolve(res);
                })
                .error(function(errData, errStatus) {                    
                    deferred.reject(errData);
                });

                return deferred.promise;
            };
        
        }]);
})();