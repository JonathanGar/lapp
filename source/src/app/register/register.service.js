(function() {

    angular
        .module('lappweb')
        .service('RegisterService', ['RESOURCE_API', 'RESOURCE_API_TEMP', '$http', '$q', '$filter', function(RESOURCE_API, RESOURCE_API_TEMP, $http, $q, $filter) {

            return service = {
                post: post
            };

            function post(itemSave) {
                var deferred = $q.defer();
                debugger;
                $http
                    .get(RESOURCE_API + '/api/Clients/' + encodeURIComponent(itemSave.email))
                    .success(function(evt1) {
                        debugger;
                        deferred.reject(evt1);
                    })
                    .error(function(data, status) {
                        debugger;
                        //console.error('Error ', data);
                        //console.info('Status', status);
                        if (data.Code == 102) {
                            $http.post(RESOURCE_API + 'api/Clients', itemSave)
                                .success(function(evt2) {
                                    debugger;
                                    deferred.resolve(evt2);
                                })
                                .error(function(errData, errStatus) {
                                    debugger;
                                    deferred.reject(errData);
                                });
                        }
                    });
                return deferred.promise;
            }
        }]);
})();