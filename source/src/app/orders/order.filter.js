(function() {

    'use strict';

    angular
        .module('lappweb')
        .filter('status', status);

    //OrdersController.$inject = ['MainService', 'OrdersService', 'toastr', '$rootScope', '$stateParams'];

    function status() {

        return function(status) {
            switch (status) {
                case "InProgress":
                    return "En Trámite"
                    break;
                case "Delivered":
                    return "Entregado"
                    break;
                case "Pending":
                    return "Pendiente"
                    break;
                case "Cancelled":
                    return "Cancelado"
                    break;
                default:
                    return ""
                    break;

            }

        }

    }

})();