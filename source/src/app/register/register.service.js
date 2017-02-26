(function() {

    angular
        .module('lappweb')
        .service('RegisterService', ['RESOURCE_API', 'RESOURCE_API_TEMP', '$http', '$q', '$filter', 'toastr', function(RESOURCE_API, RESOURCE_API_TEMP, $http, $q, $filter, toastr) {

            return service = {
                post: post,
                guid: guid
            };

            function post(itemSave) {
                var deferred = $q.defer();
                $http
                    .get(RESOURCE_API + '/api/Clients/' + encodeURIComponent(itemSave.email))
                    .success(function(evt1) {
                        toastr.error('El email ingresado ya se encuentra registrado', 'Error');
                        deferred.reject(evt1);
                    })
                    .error(function(data, status) {
                        if (data.Code == 102) {
                            itemSave.id = guid();
                            $http.post(RESOURCE_API + 'api/Clients', itemSave)
                                .success(function(evt2) {
                                    deferred.resolve(evt2);
                                })
                                .error(function(errData, errStatus) {
                                    toastr.error('Ha ocurrido un error interno', 'Información');
                                    deferred.reject(errData);
                                });
                        }
                    });
                return deferred.promise;
            };

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        }]);
})();