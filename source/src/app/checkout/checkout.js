(function(){
  'use strict';

  angular.module('lappweb')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider

        .state('checkout', {
            url: '/checkout',
            templateUrl: 'app/checkout/checkout.html',
            controller: 'CheckoutController',
            controllerAs: 'checkout'
        })
    }]);

})();
