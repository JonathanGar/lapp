(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$rootScope', '$stateParams', 'RegisterService', 'toastr', '$state', '$log', '$cookies'];

    /** @ngInject */
    function RegisterController($rootScope, $stateParams, RegisterService, toastr, $state, $log, $cookies) {
        var vm = this;
        vm.opened = false;
        vm.format = 'MM/dd/yyyy';
        vm.client = {
            gender: 0
        };
        getProfile();

        vm.SaveClient = function(client) {
            var itemSave = {
                "gender": client.gender,
                "name": client.name,
                "birthDate": client.birthDate,
                "email": client.email,
                "password": client.password,
                "phoneNumber": client.phoneNumber,
                "birthDate@odata.type": "Edm.DateTime",
                "id@odata.type": "Edm.Guid",
            };
            if (!(typeof itemSave.birthDate == 'object')) {
                itemSave.birthDate = new Date(itemSave.birthDate);
            }
            itemSave.birthDate = itemSave.birthDate.toISOString();
            RegisterService.post(itemSave).then(function(data) {
                window.logged = true;
                toastr.success('¡Usuario Registrado con Éxito!', 'Información');
                vm.client = {};
                data.logged = true;
                $cookies.putObject("client", data);
                $state.go('account');
            }, function(err) {
                //toastr.error('Ha ocurrido un error interno', 'Información');
                $log.error("err", err);
            });
        };

        //DatePicker
        vm.today = function() {
            vm.client.birthDate = new Date();
        };

        vm.clearDate = function() {
            vm.client.birthDate = null;
        };

        vm.open = function($event) {
            // $event.preventDefault();
            // $event.stopPropagation();
            vm.opened = true;
        };

        function getProfile() {
            var fb = $cookies.getObject("fb");
            if (fb && fb.id) {
                vm.fb = true,
                    vm.client.name = fb.name,
                    vm.client.email = fb.email,
                    vm.client.password = fb.id;
            }
        };
    }
})();