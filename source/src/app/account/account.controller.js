(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$window', '$uibModal', '$cookies', '$rootScope', '$stateParams', 'AccountService', 'toastr', 'MED_CODE', '$state', '$log'];

    /** @ngInject */
    function AccountController($window, $uibModal, $cookies, $rootScope, $stateParams, AccountService, toastr, MED_CODE, $state, $log) {
        var vm = this;
        $window.scrollTo(0, 0);
        var client = $cookies.getObject("client");
        vm.showForm = false;

        if (!(client && client.logged)) {
            $state.go('login');
            toastr.error('Necesita iniciar sesión primero', 'Información');
        } else {

            vm.address = {
                "phoneNumber": client.phoneNumber,
                "contactName": client.name,
            };

            vm.addAddress = function() {
                vm.showForm = true;
            };

            vm.showAddresses = function() {
                vm.showForm = false;
            };

            vm.SaveAddress = function(address) {
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
                        vm.getAddresses();
                        vm.address = {};
                    }, function(err) {
                        toastr.error('Ha ocurrido un error interno', 'Información');
                        $log.error("err", err);
                    });
                }
            };

            vm.getAddresses = function() {
                AccountService.getAddresses().then(function(addresses) {
                    var addressesList = _.filter(addresses, {
                        'clientId': client.id
                    });
                    vm.addressesList = addressesList;
                    vm.showAddresses();
                }, function(err) {
                    vm.addressesList = null;
                });
            };

            vm.deleteAddress = function(id, addressNote) {
                var flag = false;

                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title-bottom',
                    ariaDescribedBy: 'modal-body-bottom',
                    templateUrl: 'app/components/modal/modal.html',
                    size: 'sm',
                    controller: function($scope, $uibModalInstance) {
                        $scope.okBtn = "Sí";
                        $scope.cancelBtn = "No";
                        $scope.title = 'Alerta';
                        $scope.items = ["¿Desea eliminar la dirección '" + addressNote + "'?"];
                        $scope.ok = function() {
                            $uibModalInstance.close("");
                            AccountService.del(id).then(function(response) {
                                toastr.success('Dirección eliminada', 'Información');
                                vm.getAddresses();
                                vm.showAddresses();

                            }, function(err) {
                                toastr.error('Ha ocurrido un error interno', 'Información');
                            });
                        };
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                });
            };


            vm.getAddresses();
        }
    }
})();