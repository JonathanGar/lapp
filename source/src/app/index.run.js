(function() {
    'use strict';

    angular
        .module('lappweb')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope, $http, RESOURCE_API_TOKEN, AuthFactory, $uibModal, $cookies) {

        $rootScope.favorites = { products: [] };
        if (angular.isDefined(localStorage.favorites) && angular.isDefined(JSON.parse(localStorage.favorites))) {
            $rootScope.favorites.products = (JSON.parse(localStorage.favorites));
        }
        AuthFactory.fillAuthData();
        $log.debug('runBlock end');
        if(!$cookies.getObject("first")){
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-bottom',
                ariaDescribedBy: 'modal-body-bottom',
                templateUrl: 'app/components/modal/modal.html',
                size: 'sm',
                controller: function($scope, $uibModalInstance) {
                    $scope.okBtn = "Entendido";
                    $scope.cancelBtn = null;
                    $scope.title = 'Aviso';
                    $scope.items = ["Disponibilidad de servicio únicamente para el área metropolitana de Medellín"];
                    $scope.ok = function() {
                        $uibModalInstance.close("");
                    };
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
            $cookies.putObject("first", true)
        }


    }

})();