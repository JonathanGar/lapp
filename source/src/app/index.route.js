(function() {
  'use strict';

  angular
    .module('lappweb')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

    /*.state('products', {
      url: '/products/:id',
      templateUrl: 'app/productsdetail/productdetail.html',
      controller: 'ProductDetailController',
      controllerAs: 'detail'
    });*/

    $urlRouterProvider.otherwise('/');
  }

})();
