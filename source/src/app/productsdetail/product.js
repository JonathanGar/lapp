/*var productModule = angular.module('product', ['ui.router']);

productModule.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    // .state('products', {
    //     url: '/products',
    //     templateUrl: 'app/components/products/views/404.html',
    //     controller: 'product.Controller'
    // })



})*/

(function(){
  'use strict';

  angular.module('lappweb')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider

        .state('products', {
            url: '/products/:id',
            templateUrl: 'app/productsdetail/productdetail.html',
            controller: 'ProductDetailController',
            controllerAs: 'detail'
        })
    }]);

})();
