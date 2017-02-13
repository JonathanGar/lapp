(function() {

    'use strict';

    angular
        .module('lappweb')
        .filter('status', status)
        .filter('status_desc', status_desc)
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
        };
    };

    function status_desc(){
        return function(status){
            switch (status) {
                case "InProgress":
                    return "Su pedido está siendo procesado en este momento..."
                    break;
                case "Delivered":
                    return "Su pedido ya ha sido entregado y cancelado."
                    break;
                case "Pending":
                    return "Su pedido está pendiente por entregar."
                    break;
                case "Cancelled":
                    return "Su pedido se ha cancelado."
                    break;
                default:
                    return ""
                    break;
            }
        };
    };

    function address() {
        return function(str) {
            try {
                var split = str.split("|");
                return split[0] + " " + split[1] + " #" + split[2] + " - " + split[3];
            } catch (e) {
                return str;
            }
        };
    };




})();