(function() {

    angular
        .module('lappweb')
        .service('Utilities', ['$uibModal', 'GRAPH_API_URL', 'RESOURCE_API', 'RESOURCE_API_TOKEN', 'MED_CODE', '$http', '$q', '$rootScope', '$log',
            function($uibModal, GRAPH_API_URL, RESOURCE_API, RESOURCE_API_TOKEN, MED_CODE, $http, $q, $rootScope, $log) {

                var service = {
                    isEmail: isEmail,
                    showModal: showModal,
                    verifyCaptcha: verifyCaptcha
                };

                return service;

                function isEmail(email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };

                function showModal(okBtn, cancelBtn, title, items) {
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
                };

                function verifyCaptcha(params) {
                    //debugger;
                    var deferred = $q.defer();
                    var req = {
                        "method": 'POST',
                        "url": "https://www.google.com/recaptcha/api/siteverify?secret=" + params.secret + "&response=" + params.response,
                        "headers": {
                            'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
                        }
                    }
                    $http(req).success(function(response) {
                        //debugger;
                        deferred.resolve(response);
                    }).
                    error(function(err) {
                        //debugger;
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }

            }
        ]);
})();