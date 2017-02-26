(function() {

    angular
        .module('lappweb')
        .service('Utilities', ['$uibModal', 'GRAPH_API_URL', 'RESOURCE_API', 'RESOURCE_API_TOKEN', 'MED_CODE', '$q', '$rootScope', '$log',
            function($uibModal, GRAPH_API_URL, RESOURCE_API, RESOURCE_API_TOKEN, MED_CODE, $q, $rootScope, $log) {

                var service = {
                    isEmail: isEmail,
                    showModal: showModal
                };

                return service;

                function isEmail(email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };

                function showModal(okBtn, cancelBtn = null, title, items) {
                    $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title-bottom',
                        ariaDescribedBy: 'modal-body-bottom',
                        templateUrl: 'app/components/modal/modal.html',
                        size: 'sm',
                        controller: function($scope, $uibModalInstance) {
                            $scope.okBtn = okBtn;
                            $scope.cancelBtn = cancelBtn;
                            $scope.title = title;
                            $scope.items = items;
                            $scope.ok = function() {
                                $uibModalInstance.close("");
                            };
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    });
                }

            }
        ]);
})();