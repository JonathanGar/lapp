(function() {
    'use strict';

    angular
        .module('lappweb')
        .component('modalComponent', {
            templateUrl: 'modal.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function() {
                var $ctrl = this;

                $ctrl.$onInit = function() {
                    $ctrl.title = $ctrl.resolve.title;
                    $ctrl.items = $ctrl.resolve.items;
                };

                $ctrl.ok = function() {
                    $ctrl.close({ $value: '' });
                };

                $ctrl.cancel = function() {
                    $ctrl.dismiss({ $value: 'cancel' });
                };
            }
        });
})();