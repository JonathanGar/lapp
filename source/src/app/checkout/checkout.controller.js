(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['$rootScope', '$stateParams', '$cookies', 'CheckoutService', 'toastr', '$log', 'CartService', '$state'];

    /** @ngInject */
    function CheckoutController($rootScope, $stateParams, $cookies, CheckoutService, toastr, $log, CartService, $state) {
        var vm = this,
            oldSchedule = null;
        vm.logged = false, vm.step1 = "glyphicon-remove", vm.step4 = "glyphicon-remove",
            vm.clientName = '', vm.clientEmail = '';

        init();

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

        function init() {
            getCarProducts();
            var client = $cookies.getObject("client");
            if (client && client.logged) {
                vm.logged = true;
                vm.step1 = "glyphicon-ok";
            }
            getServiceAvailability();
        };

        function getServiceAvailability() {
            CheckoutService.getServiceAvailability().then(
                function(schedules) {
                    var schedulesCtr = [];
                    var hoy = new Date("January 26, 2017 11:13:00");
                    angular.forEach(schedules, function(value, key) {
                        schedules[key].dateTime = new Date(value.dateTime);
                        if (schedules[key].dateTime - hoy > 0) {
                            schedules[key].cuando = (schedules[key].dateTime.getDate() == hoy.getDate() + 1) ? "Mañana" : '';
                            schedulesCtr.push(schedules[key]);
                        }
                    });
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
                vm.products = res;
                vm.subtotal = 0;
                angular.forEach(res, function(product, key) {
                    vm.subtotal += product.value;
                });
                console.log(res);
                debugger;
            }, function(err) {
                toastr.error("Debe añadir productos al carrito", "Error");
                $state.go("home");
            });
        };

        function setSchedule(schedule) {
            if (oldSchedule) {
                var _oldSchedule = _.find(vm.schedulesCtr, { "id": oldSchedule });
                debugger;
                _oldSchedule.active = '';
            } else {
                oldSchedule = schedule.id;
            }
            schedule.active = "active";
            oldSchedule = schedule.id;
            vm.establishedSched = schedule;
            vm.step4 = "glyphicon-ok";
        };

        vm.applyCoupon = applyCoupon;
        vm.setSchedule = setSchedule;
    }
})();