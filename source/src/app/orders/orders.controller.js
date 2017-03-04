(function() {

    'use strict';

    angular
        .module('lappweb')
        .controller('OrdersController', OrdersController);

    OrdersController.$inject = ['$window', 'MainService', 'OrdersService', 'toastr', '$rootScope', '$stateParams', '$log', '$cookies', '$state'];

    function OrdersController($window, MainService, OrdersService, toastr, $rootScope, $stateParams, $log, $cookies, $state) {
        var vm = this;
        $window.scrollTo(0, 0);
        /*var settings = JSON.parse(localStorage.getItem('settings')); */
        var client = $cookies.getObject("client");
        if (client) {
            vm.clientId = client.id; //"6e02f8b3-e609-47ea-9997-4f26ad938066";
            vm.clientName = client.name;
        } else {
            toastr.error("Debe iniciar sesión para ver sus pedidos", "Aviso");
            $state.go('login');
        }

        if ($stateParams.id) {
            OrdersService.order($stateParams.id).then(function(order) {
                if (!order.message) {
                    vm.detail = order;
                }
            }).catch(function(err) {
                $log.error('Error fetching feed:', err);
            });

        } else if (vm.clientId) {
            OrdersService.orders().then(function(orders) {
                if (!orders.message) {
                    debugger;
                    vm.orders = _.filter(orders, { "clientId": vm.clientId });
                }
                if (vm.orders.length === 0) {
                    toastr.error("Aún no ha registrado pedidos", "Aviso");
                }
            }).catch(function(err) {
                $log.error('Error fetching feed:', err);
            });
        }


        //Metodos jQuery
        $('.star').on('click', function() {
            $(this).toggleClass('star-checked');
        });

        $('.ckbox label').on('click', function() {
            $(this).parents('tr').toggleClass('selected');
        });

        $('.btn-filter').on('click', function() {
            var $target = $(this).data('target');
            if ($target != 'all') {
                $('.table tr').css('display', 'none');
                $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
            } else {
                $('.table tr').css('display', 'none').fadeIn('slow');
            }
        });

        /*tabs*/
        var tabsFinish = 0;
        $('.tab-switcher').on('click', function() {
            if ($(this).hasClass('active') || tabsFinish) return false;
            tabsFinish = 1;
            var thisIndex = $(this).parent().find('.tab-switcher').index(this);
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');

            $(this).closest('.tabs-container').find('.tabs-entry:visible').animate({ 'opacity': '0' }, 300, function() {
                $(this).hide();
                var showTab = $(this).parent().find('.tabs-entry').eq(thisIndex);
                showTab.show().css({ 'opacity': '0' });
                if (showTab.find('.swiper-container').length) {
                    swipers['swiper-' + showTab.find('.swiper-container').attr('id')].resizeFix();
                    if (!showTab.find('.swiper-active-switch').length) showTab.find('.swiper-pagination-switch:first').addClass('swiper-active-switch');
                }
                showTab.animate({ 'opacity': '1' }, function() { tabsFinish = 0; });
            });
        });
    }

})();