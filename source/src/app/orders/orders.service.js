(function () {

  'use strict';

  angular
    .module('lappweb')
    .factory('OrdersService',OrdersService);

  function OrdersService() {
    return{
      my: myOrders
    }

    function myOrders() {

    }
  }

})();
