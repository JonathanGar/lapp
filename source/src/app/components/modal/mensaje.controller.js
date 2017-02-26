(function() {
    'use strict';

    angular
        .module('lappweb')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', 'title'];

    /** @ngInject */
    function ModalInstanceCtrl($uibModalInstance, items, title) {
        var $ctrl = this;

        $ctrl.items = items;
        $ctrl.title = title;

        $ctrl.ok = function() {
            $uibModalInstance.close($ctrl.selected.item);
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }

})();