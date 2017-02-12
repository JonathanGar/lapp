(function() {

    'use strict';

    angular
        .module('lappweb')
        .filter('status', status)
        .filter('address', address);

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
    };

    function address() {
        return function(str) {
            try {
                var split = str.split("|");
                return split[0] + " " + split[1] + " #" + split[2] + " - " + split[3];
            } catch (e) {
                return str;
            }
        }
    };




})();