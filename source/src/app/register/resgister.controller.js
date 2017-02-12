(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$rootScope', '$stateParams', 'RegisterService', 'toastr'];

    /** @ngInject */
    function RegisterController($rootScope, $stateParams, RegisterService, toastr) {
        var vm = this;

        vm.format = 'MM/dd/yyyy';
        vm.client = {
            gender: 0
        }

        vm.SaveClient = function(client) {
            var itemSave = {
                "gender": (client.gender == 1) ? "Female" : "Male",
                "name": client.name,
                "birthDate": client.birthDate,
                "email": client.email,
                "password": client.password,
                "phoneNumber": client.phoneNumber
            };
            debugger;
            RegisterService.post(itemSave).then(function(data) {
                debugger;
                console.log(data);
                vm.client = {};
            }, function(err) {
                toastr.error('Ha ocurrido un error interno', 'Información');
                console.error("err", err);
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
    }
})();