(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['MainService', '$rootScope', '$stateParams', '$auth', '$state', 'toastr', 'LoginService', '$cookies', '$location', 'AuthFactory'];

    /** @ngInject */
    function LoginController(MainService, $rootScope, $stateParams, $auth, $state, toastr, LoginService, $cookies, $location, AuthFactory) {
        var vm = this;

        if (window.logged) {
            $state.go("account");
        }

        vm.authenticate = function(provider) {
            $auth.authenticate(provider).then(function(response) {
                    MainService.getFacebookProfile(response.access_token).then(function(dataFacebook) {
                        $cookies.putObject("fb", dataFacebook);
                        AuthFactory.existsEmail(dataFacebook.email).then(
                            function(dataEmail) {
                                //Existe la cuenta                                
                                LoginService.Login(dataFacebook.email, dataFacebook.id).then(function(user) {
                                    toastr.success(user.name, "Bienvenido");
                                    window.logged = true;
                                    $state.go('orders');
                                }, function(err) {
                                    if (err.Code == 110) {
                                        toastr.error("La cuenta " + dataFacebook.email + " ya se encuentra registrada", "Error");
                                        $state.go('loginForm');
                                    } else {
                                        toastr.error("Error interno", "Error");
                                    }
                                });

                            },
                            function(responseErr) {
                                //La cuenta no existe
                                if (responseErr.Code == 102) {
                                    $state.go('register');
                                } else {
                                    toastr.error("Error interno", "Error");
                                }
                            }
                        );
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