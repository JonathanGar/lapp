(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['Utilities', '$window', '$rootScope', '$stateParams', '$cookies', 'CheckoutService', 'toastr', '$log', 'CartService', '$state', 'AccountService', 'vcRecaptchaService'];

    /** @ngInject */
    function CheckoutController(Utilities, $window, $rootScope, $stateParams, $cookies, CheckoutService, toastr, $log, CartService, $state, AccountService) {
        //Schedule: Service Availability 
        $window.scrollTo(0, 0);
        var vm = this,
            oldSchedule = null,
            oldAddress = null;
        vm.logged = false,
            vm.step1 = "glyphicon-remove",
            vm.step4 = "glyphicon-remove",
            vm.step5 = "glyphicon-remove",
            vm.clientName = '',
            vm.clientEmail = '',
            vm.client, vm.onSpinner = false;

        init();

        function init() {
            getCarProducts();
            var client = $cookies.getObject("client");
            if (client && client.logged) {
                vm.logged = true;
                vm.step1 = "glyphicon-ok";
                vm.client = client;
                getAddresses();
            }
            getServiceAvailability();
        };

        $('.accordeon-title').on('click', function() {
            $(this).toggleClass('active');
            $(this).next().slideToggle();
        });

        function applyCoupon() {
            if (!vm.coupon) {
                toastr.error("Por favor ingrese un código", "Aviso");
            } else {
                CheckoutService.getCoupon(vm.coupon).then(
                    function(res) {
                        toastr.sucess("Código registrado", "Éxito");
                        vm.couponRegistered = true;
                    },
                    function(err) {
                        toastr.error(err.Description, "Aviso");
                    }
                );
            }
        };

        function getServiceAvailability() {
            CheckoutService.getServiceAvailability().then(
                function(schedules) {
                    var schedulesCtr = [];
                    var hoy = new Date();
                    //var hoy = new Date("January 26, 2017 11:13:00");
                    angular.forEach(schedules, function(value, key) {
                        schedules[key].dateTime = new Date(value.dateTime);
                        if (schedules[key].dateTime - hoy > 0) {
                            schedules[key].cuando = (schedules[key].dateTime.getDate() == hoy.getDate() + 1) ? "Mañana" : '';
                            schedulesCtr.push(schedules[key]);
                        }
                    });

                    if (schedulesCtr.length === 0) {
                        toastr.error("No tenemos disponibilidad horaria.", "Lo sentimos");
                        return false;
                    }
                    schedulesCtr.sort(function(a, b) {
                        return a.dateTime - b.dateTime;
                    });

                    vm.schedulesCtr = schedulesCtr;
                },
                function(err) {
                    $log.error("Error al extraer los horarios disponibles");
                }
            );
        };

        function getCarProducts() {
            CartService.get().then(function(res) {
                //debugger;
                vm.products = res;
                vm.subtotal = 0;
                angular.forEach(res, function(product, key) {
                    vm.subtotal += product.value;
                });
            }, function(err) {
                toastr.error("Debe añadir productos al carrito", "Error");
                $state.go("home");
            });
        };

        function setSchedule(schedule) {
            //debugger;
            if (oldSchedule) {
                var _oldSchedule = _.find(vm.schedulesCtr, { "id": oldSchedule });
                _oldSchedule.active = '';
            } else {
                oldSchedule = schedule.id;
            }
            schedule.active = "active";
            oldSchedule = schedule.id;
            vm.establishedSched = schedule;
            vm.step5 = "glyphicon-ok";
        };

        function setAddress(address) {
            //debugger;
            if (oldAddress) {
                var _oldAddress = _.find(vm.addressesList, { "id": oldAddress });
                _oldAddress.active = '';
            } else {
                oldAddress = address.id;
            }
            address.active = "active";
            oldAddress = address.id;
            vm.establishedAddress = address;
            vm.step4 = "glyphicon-ok";
        };

        function getAddresses() {
            AccountService.getAddresses().then(function(addresses) {
                var addressesList = _.filter(addresses, {
                    'clientId': vm.client.id
                });
                vm.addressesList = addressesList;
                if (!vm.addressesList) {
                    vm.NOaddresses = true;
                }
            }, function(err) {
                vm.addressesList = null;
            });
        };

        function check() {
            var items = [],
                response = true;
            if (!vm.client) {
                items.push("* Debe iniciar sesión para realizar su pedido");
                response = false;
            }

            if (vm.clientName == '' || !Utilities.isEmail(vm.clientEmail)) {
                items.push("* Debe verificar los campos de 'Datos de Facturación'");
                response = false;
            }

            if (!vm.establishedAddress) {
                items.push("* Debe seleccionar una dirección de envío");
                response = false;
            }

            if (!vm.establishedSched) {
                items.push("* Debe seleccionar un horario de entrega");
                response = false;
            }

            if (!response) {
                Utilities.showModal("OK", null, "Aviso", items);
                return false;
            }

            return true;
        };

        function post() {
            //vm.captcha();
            //debugger;

            if (check()) {
                var coupon = (vm.coupon) ? vm.coupon : "";
                var delivery = {
                    "employeeId": vm.establishedSched.employeeId,
                    "serviceAvailabilityId": vm.establishedSched.id,
                    "clientId": vm.client.id,
                    "addressId": vm.establishedAddress.id,
                    "total": vm.subtotal,
                    "deliveryCost": 0,
                    "couponsRedeemed": 0,
                    "coupon": vm.coupon,
                    "deliveryDateTime": vm.establishedSched.dateTime,
                    "EffortPoints": vm.establishedSched.assignedEffortPoints
                };
                vm.onSpinner = true;
                CheckoutService.post(delivery, vm.products).then(function(response) {
                    vm.onSpinner = false;
                    //debugger;
                    Utilities.showModal("OK", null, "Éxito", ["Hemos registrado su pedido. Pronto nos comunicaremos con usted."]);
                    $state.go("home");
                }, function(err) {
                    vm.onSpinner = false;
                    toastr.error("Error al enviar el pedido. Inténtalo más tarde.", "Error");
                    //debugger;
                });
            }
        };

        function captcha() {
            Utilities.verifyCaptcha({ secret: "6Lcj7BYUAAAAALzKvJZ0SlDIKXJR2J6bfs64PPzv", response: vm.recaptchaResponse }).then(function(response) {
                console.log("3")
                post();
            }, function(err) {

                console.log("3.0")
                post();
            });
        };

        function gotoLogin() {
            //debugger;
            $window.checkout = true;
            $state.go("login");
        };

        vm.applyCoupon = applyCoupon;
        vm.setSchedule = setSchedule;
        vm.setAddress = setAddress;
        vm.getAddresses = getAddresses;
        vm.post = post;
        vm.check = check;
        vm.captcha = captcha;
        vm.gotoLogin = gotoLogin;
    }
})();