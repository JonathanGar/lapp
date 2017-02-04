(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['MainService', '$rootScope', '$stateParams', '$auth', '$state', 'toastr', 'LoginService'];

    /** @ngInject */
    function LoginController(MainService, $rootScope, $stateParams, $auth, $state, toastr, LoginService) {
        var vm = this;

        vm.authenticate = function(provider) {
            $auth.authenticate(provider).then(function(response) {
                    debugger;
                    MainService.getFacebookProfile(response.access_token).then(function(data) {
                        debugger;
                    });
                    toastr.success("Sesión Iniciada", "Aviso");
                    $state.go('home');
                })
                .catch(function(response) {
                    toastr.error("Error iniciando sesión", "Error");
                });
        };

        vm.login = function(user, pass) {
            debugger;
            LoginService.Login("hola", "mundo")
                .success(function(res) {
                    debugger;
                }).then(function(data) {
                    debugger;
                }, function(err) {
                    debugger;
                });
        };
    }

})();