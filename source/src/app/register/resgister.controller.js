(function () {
    'use strict';

    angular
      .module('lappweb')
      .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$rootScope', '$stateParams', 'RegisterService'];

    /** @ngInject */
    function RegisterController($rootScope, $stateParams, RegisterService) {
        var vm = this;

        vm.format = 'MM/dd/yyyy';
        vm.client= {
          gender: 0
        }

        vm.SaveClient = function (client) {
            var itemSave= {
              "Gender": 0,
              "Name":client.name,
              "BirthDate": client.birthDate,
              "Email": client.email,
              "Password": client.password,
              "PhoneNumber": client.phoneNumber
            };
            debugger
            RegisterService.post(itemSave).then(function (data) {
              debugger
                console.log(data);
                vm.client = {};
            });
        };


        //DatePicker
        vm.today = function () {
            vm.client.birthDate = new Date();
        };

        vm.clearDate = function () {
            vm.client.birthDate = null;
        };

        vm.open = function ($event) {
            // $event.preventDefault();
            // $event.stopPropagation();

            vm.opened = true;
        };
    }
})();
