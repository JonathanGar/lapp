(function(){
  'use strict';

  angular.module('lappweb')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('account', {
            url: '/account',
            templateUrl: 'app/account/account.html',
            controller: 'AccountController',
            controllerAs: 'account'
        })
    }]);

})();
