(function() {
    'use strict';

    angular
        .module('lappweb')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope, $http, RESOURCE_API_TOKEN, AuthFactory) {

        $rootScope.favorites = { products: [] };
        if (angular.isDefined(localStorage.favorites) && angular.isDefined(JSON.parse(localStorage.favorites))) {
            $rootScope.favorites.products = (JSON.parse(localStorage.favorites));
        }
        AuthFactory.fillAuthData();
        $log.debug('runBlock end');
    }

})();