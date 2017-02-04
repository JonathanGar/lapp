(function(){
  'use strict';

  angular.module('lappweb')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider

        .state('favorites', {
            url: '/favorites',
            templateUrl: 'app/favorites/favorites.html',
            controller: 'FavoritesController',
            controllerAs: 'favorites',
            authenticate: true
        })
    }]);

})();
