(function () {

    angular
        .module('lappweb')
        .service('RegisterService', ['RESOURCE_API', 'RESOURCE_API_TEMP', '$http', '$q', '$filter', function (RESOURCE_API, RESOURCE_API_TEMP, $http, $q, $filter) {

            return service = {
                post: post
            };

            function post(data) {
              debugger
                var deferred = $q.defer();
                $http
                  .post(RESOURCE_API_TEMP+'Clients', data)
                  .success(function (evt) {
                    debugger
                    deferred.resolve(evt);
                  })
                  .error(function(data, status) {
                    debugger
                    console.error('Error ', data);
                    console.info('Status', status);
                  });
                return deferred.promise;
            }
        }]);
})();
