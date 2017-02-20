(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$cookies', '$rootScope', '$stateParams', 'AccountService', 'toastr', 'MED_CODE', '$state', '$log'];

    /** @ngInject */
    function AccountController($cookies, $rootScope, $stateParams, AccountService, toastr, MED_CODE, $state, $log) {
        var vm = this;
        var client = $cookies.getObject("client");
        if (!(client && client.logged)) {
            $state.go('login');
            toastr.error('Necesita iniciar sesión primero', 'Información');
        } else {
            /*$rootScope.client = {            
                "name": "Jonathan García Escudero",                        
                "phoneNumber": "1234567",
                "id": "6e02f8b7-e609-47ea-9997-4f26ad938067"
            };*/

            vm.address = {
                "phoneNumber": client.phoneNumber,
                "contactName": client.name,
            };

            vm.SaveAddress = function(address) {
                debugger;
                if (!(/^[a-z0-9]+$/i.test(address.dir_1))) {
                    toastr.error("Por favor corrija el literal " + address.dir_0 + ": ", "Aviso");
                } else if (!(/^[a-z0-9]+$/i.test(address.dir_2))) {
                    toastr.error("Por favor corrija el literal #", "Aviso");
                } else if (!(/^[a-z0-9]+$/i.test(address.dir_3))) {
                    toastr.error("Por favor corrija el literal -", "Aviso");
                } else {

                    var add = address.dir_0 + "|" + address.dir_1 + "|" + address.dir_2 + "|" + address.dir_3;
                    var itemSave = {
                        "mainAddress": add,
                        "notes": address.notes,
                        "type": address.type,
                        "phoneNumber": address.phoneNumber,
                        "contactName": address.contactName,
                        "clientId": client.id,
                        "zoneId": MED_CODE,
                    };

                    AccountService.post(itemSave).then(function(address) {
                        toastr.success('Se ha creado la dirección', 'Éxito');
                        vm.address = {};
                    }, function(err) {
                        toastr.error('Ha ocurrido un error interno', 'Información');
                        $log.error("err", err);
                    });
                }
            };
        }
    }
})();