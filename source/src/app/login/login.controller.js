(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['MainService', '$rootScope', '$stateParams', '$auth', '$state', 'toastr', 'LoginService', '$cookies', '$location'];

    /** @ngInject */
    function LoginController(MainService, $rootScope, $stateParams, $auth, $state, toastr, LoginService, $cookies, $location) {
        var vm = this;

        vm.authenticate = function(provider) {
            $auth.authenticate(provider).then(function(response) {
                    MainService.getFacebookProfile(response.access_token).then(function(data) {
                        LoginService.Login(data.email, pass).then(function(user) {
                            toastr.success(user.name, "Bienvenido");
                            window.logged = true;
                            $state.go('orders');
                        }, function(err) {
                            var desc = "";
                            if (err) {
                                desc = err.Description;
                            } else if (err === undefined) {
                                desc = "Error interno";
                            }
                            toastr.error(desc, "Error");
                        });

                        toastr.success(data.name, "Bienvenido");
                        $cookies.putObject("fb", data);
                        $state.go('register');
                    });

                })
                .catch(function(response) {
                    toastr.error("Error iniciando sesión", "Error");
                });
        };

        vm.login = function(user, pass) {
            LoginService.Login(user, pass).then(function(user) {
                toastr.success(user.name, "Bienvenido");
                window.logged = true;
                $state.go('orders');
            }, function(err) {
                var desc = "";
                if (err) {
                    desc = err.Description;
                } else if (err === undefined) {
                    desc = "Error interno";
                }
                toastr.error(desc, "Error");
            });
        };

        $('input').blur(function() {
            var $this = $(this);
            if ($this.val())
                $this.addClass('used');
            else
                $this.removeClass('used');
        });
    }

})();