(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$window', 'MainService', '$rootScope', '$stateParams', '$auth', '$state', 'toastr', 'LoginService', '$cookies', '$location', 'AuthFactory'];

    /** @ngInject */
    function LoginController($window, MainService, $rootScope, $stateParams, $auth, $state, toastr, LoginService, $cookies, $location, AuthFactory) {
        var vm = this;
        $window.scrollTo(0, 0);
        vm.onSpinner = false;

        if (window.logged) {
            $state.go("account");
        }

        function authenticate(provider) {
            $auth.authenticate(provider).then(function(response) {
                    vm.onSpinner = true;
                    MainService.getFacebookProfile(response.access_token).then(function(dataFacebook) {
                        $cookies.putObject("fb", dataFacebook);
                        AuthFactory.existsEmail(dataFacebook.email).then(
                            function(dataEmail) {
                                //Existe la cuenta                                
                                LoginService.Login(dataFacebook.email, dataFacebook.id).then(function(user) {
                                    vm.onSpinner = false;
                                    toastr.success(user.name, "Bienvenido");
                                    window.logged = true;
                                    _goto();
                                }, function(err) {
                                    vm.onSpinner = false;
                                    if (err.Code == 110) {
                                        toastr.error("La cuenta " + dataFacebook.email + " ya se encuentra registrada", "Error");
                                        $state.go('loginForm');
                                    } else {
                                        toastr.error("Error interno", "Error");
                                    }
                                });
                            },
                            function(responseErr) {
                                vm.onSpinner = false;
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
                    vm.onSpinner = false;
                    toastr.error("Error iniciando sesión", "Error");
                });
        };


        function login(user, pass) {
            LoginService.Login(user, pass).then(function(user) {
                toastr.success(user.name, "Bienvenido");
                window.logged = true;
                _goto();
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

        function _goto() {
            debugger;
            if ($window.checkout) {
                $state.go('checkout');
            } else {
                $state.go('orders');
            }
        };

        $('input').blur(function() {
            var $this = $(this);
            if ($this.val())
                $this.addClass('used');
            else
                $this.removeClass('used');
        });

        vm.login = login;
        vm.authenticate = authenticate;
    }

})();