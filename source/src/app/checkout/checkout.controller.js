(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('CheckoutController', CheckoutController);

    CheckoutController.$inject = ['$rootScope', '$stateParams', '$cookies', 'CheckoutService', 'toastr', '$log', 'CartService', '$state', 'AccountService'];

    /** @ngInject */
    function CheckoutController($rootScope, $stateParams, $cookies, CheckoutService, toastr, $log, CartService, $state, AccountService) {
        //Schedule: Service Availability 
        var vm = this,
            oldSchedule = null,
            oldAddress = null;
        vm.logged = false, vm.step1 = "glyphicon-remove", vm.step4 = "glyphicon-remove", vm.step5 = "glyphicon-remove",
            vm.clientName = '', vm.clientEmail = '', vm.client;

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
                vm.client = client;
                getAddresses();
            }
            getServiceAvailability();
        };

        function getServiceAvailability() {
            CheckoutService.getServiceAvailability().then(
                function(schedules) {
                    var schedulesCtr = [];
                    //TODO
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
            }, function(err) {
                toastr.error("Debe añadir productos al carrito", "Error");
                $state.go("home");
            });
        };

        function setSchedule(schedule) {
            debugger;
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
            debugger;
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

        function post() {
            var delivery = {
                //"createdAt": "2016-09-09T15:12:51.756Z",
                //"version": "AAAAAAAAI7Y=",
                //"id": "02a96a57-9164-4fb6-be4f-e698238136e9",
                "employeeId": vm.establishedSched.employeeId,
                "serviceAvailabilityId": vm.establishedSched.id,
                "clientId": vm.client.id,
                "addressId": vm.establishedAddress.id,
                //"employeeEffortPoints": 0,
                //"systemEffortPoints": 20,
                "total": vm.subtotal,
                //"totalDiscounts": -4800,
                "deliveryCost": 5500,
                "couponsRedeemed": 0,
                "coupon": vm.coupon,
                //"deliverySecondaryId": "LR1473433972",
                //"invoiceNumber": null,
                "deliveryDateTime": vm.establishedSched.dateTime,
                //"deliveredAt": "2016-09-09T10:12:50Z",
                //"attendanceStartedAt": "1900-01-01T00:00:00Z",
                //"sentAt": "2016-09-09T10:12:50Z",
                //"status": "Cancelled"
            };
            CheckoutService.post(delivery).then(function(response) {
                debugger;
            }, function(err) {
                debugger;
            });
        };

        vm.applyCoupon = applyCoupon;
        vm.setSchedule = setSchedule;
        vm.setAddress = setAddress;
        vm.getAddresses = getAddresses;
        vm.post = post;
    }
})();