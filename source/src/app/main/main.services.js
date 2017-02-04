(function() {

    angular
        .module('lappweb')
        .service('MainService', ['GRAPH_API_URL', 'RESOURCE_API', 'RESOURCE_API_TOKEN', 'MED_CODE', '$http', '$q', '$filter', '$rootScope',
            function(GRAPH_API_URL, RESOURCE_API, RESOURCE_API_TOKEN, MED_CODE, $http, $q, $filter, $rootScope) {

                var service = {
                    fillAuthData: fillAuthData,
                    get: get,
                    products: getProducts,
                    catalogs: catalogs,
                    post: post,
                    put: put,
                    drop: drop,
                    getSettings: getSettings,
                    getFacebookProfile: getFacebookProfile,
                    _authentication: _authentication,
                    obtainAccessToken: obtainAccessToken
                };

                var _authentication = {
                    isAuth: false,
                    userName: "",
                    useRefreshTokens: false
                };

                return service;

                function _logOut() {

                    $rootScope.globals = {};

                    _authentication.isAuth = false;
                    _authentication.userName = "";
                    _authentication.useRefreshTokens = false;

                };

                function fillAuthData() {
                    //var authData = localStorageService.get('authorizationData');
                    try {
                        var authData = $rootScope.globals.authorizationData;
                    } catch (err) {
                        //console.log(err);
                    }

                    if (authData) {
                        _authentication.isAuth = true;
                        _authentication.userName = authData.userName;
                        _authentication.useRefreshTokens = authData.useRefreshTokens;
                    }
                };

                function obtainAccessToken() {

                    var deferred = $q.defer();

                    //$http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function(response) {
                    $http({
                        url: RESOURCE_API_TOKEN,
                        method: 'POST',
                        data: "&Scope=" + encodeURIComponent("website") +
                            "&grant_type=" + encodeURIComponent("client_credentials") +
                            "&client_secret=" + encodeURIComponent("123@abc") +
                            "&client_id=" + encodeURIComponent("ef4151a8-4809-4fdc-94c3-623dc45367f7"),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).success(function(response) {
                        //localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });
                        $rootScope.globals = {
                            authorizationData: {
                                token: response.access_token,
                                userName: "",
                                refreshToken: "",
                                useRefreshTokens: false
                            },
                            accessToken: response.access_token
                        };

                        _authentication.isAuth = true;
                        _authentication.userName = "";
                        _authentication.useRefreshTokens = false;

                        deferred.resolve(response);

                    }).error(function(err, status) {
                        _logOut();
                        deferred.reject(err);
                    });

                    return deferred.promise;

                };

                function get() {
                    var deferred = $q.defer();
                    $http.get(RESOURCE_API + 'categories')
                        //$http.get('./assets/data/categories.json')
                        .success(function(categories) {
                            deferred.resolve(categories);
                        })
                        .error(function(data, status, headers, config) {
                            // data is always undefined here when there is an error
                            console.error('Error fetching feed:', data);
                        });
                    return deferred.promise;
                };

                function catalogs(token) {
                    var deferred = $q.defer();
                    //$http.get('./assets/data/catalogs.json')
                    $http({
                            url: RESOURCE_API + "api/catalog/" + MED_CODE,
                            method: "GET",
                        })
                        .success(function(catalogs) {
                            deferred.resolve(catalogs);
                        })
                        .error(function(data, status, headers, config) {
                            // data is always undefined here when there is an error
                            console.error('Error fetching feed:', data);
                        });
                    return deferred.promise;
                };

                function getProducts() {
                    var deferred = $q.defer();
                    $http.get(RESOURCE_API + 'products')
                        //$http.get('./assets/data/products.json')
                        .success(function(categories) {
                            deferred.resolve(categories);
                        })
                        .error(function(data, status, headers, config) {
                            // data is always undefined here when there is an error
                            console.error('Error fetching feed:', data);
                        });
                    return deferred.promise;
                };

                function post(data) {
                    var deferred = $q.defer();
                    $http.post('/api/v1/planning/maintenance', data).success(function(evt) {
                        deferred.resolve(evt);
                    });
                    return deferred.promise;
                };

                function put(id) {
                    var deferred = $q.defer();
                    $http.put('/api/v1/planning/maintenance/:id', {
                        id: id
                    }).success(function(evt) {
                        deferred.resolve(evt);
                    });
                    return deferred.promise;
                };

                function drop(id) {
                    var deferred = $q.defer();
                    $http.delete('/api/v1/planning/maintenance/:id', {
                        id: id
                    }).success(function(data) {
                        deferred.resolve(evt);
                    });
                    return deferred.promise;
                };

                function getSettings() {
                    var deferred = $q.defer();

                    var settings = [{
                        "deleted": false,
                        "updatedAt": "2016-07-05T18:45:49.951Z",
                        "createdAt": "2016-07-05T18:45:49.951Z",
                        "version": "AAAAAAAADFc=",
                        "id": "1cae9181e7e9477ead072232e365fa92",
                        "value": "Lapp Tienda",
                        "key": "FacebookDisplayName"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-03T08:59:37.78Z",
                        "createdAt": "2016-06-27T03:30:11.429Z",
                        "version": "AAAAAAAADAs=",
                        "id": "21f0a5c5513944cf805827494ee4a2ea",
                        "value": "Los presentes Términos y Condiciones rigen el uso que toda persona natural o jurídica, o representante en cualquier forma de los mismos, hace de la Plataforma y de cualquier Servicio que sea de propiedad o esté controlado por Mercadoni. Este documento contiene información legal que le recomendamos leer completamente en conjunto con la Política de Privacidad. Por medio de la aprobación de los presentes Términos y Condiciones, se entiende que el Usuario los ha leído y aceptado, en todas sus partes, y entiende que estos le son legalmente vinculantes y obligatorios. Por tanto, acepta las condiciones de utilización y aprovechamiento de la Plataforma, Contenido y los Servicios. En caso contrario, el Usuario deberá abstenerse de acceder a la Plataforma y Servicios, ya sea directa o indirectamente, y de utilizar cualquier información o servicio provisto por la misma.",
                        "key": "Policies"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-03T09:00:20.296Z",
                        "createdAt": "2016-07-03T09:00:20.296Z",
                        "version": "AAAAAAAADA8=",
                        "id": "2a56c1c0f6e44efb996128d9f34310e2",
                        "value": "http://facebook.com/lapptienda",
                        "key": "Facebook"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-05T18:44:19.995Z",
                        "createdAt": "2016-07-05T18:44:19.995Z",
                        "version": "AAAAAAAADFU=",
                        "id": "73d4536af5a94fc78d8dbca459dce173",
                        "value": "@Lapptienda",
                        "key": "TwitterDisplayName"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-03T09:00:01.952Z",
                        "createdAt": "2016-07-03T09:00:01.952Z",
                        "version": "AAAAAAAADA0=",
                        "id": "7518c2d7808d41f5b00897677427d398",
                        "value": "http://twitter.com/lapptienda",
                        "key": "Twitter"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-03T09:01:00.844Z",
                        "createdAt": "2016-07-03T09:01:00.844Z",
                        "version": "AAAAAAAADBM=",
                        "id": "a6f7cc6f86bd4f7da2d7121b9b7ba8a6",
                        "value": "555-5555",
                        "key": "SupportPhoneNumber"
                    }, {
                        "deleted": false,
                        "updatedAt": "2016-07-03T09:00:44.593Z",
                        "createdAt": "2016-07-03T09:00:44.593Z",
                        "version": "AAAAAAAADBE=",
                        "id": "e69c07a4187a4bb5948aad332cf672a7",
                        "value": "info@lapptienda.com",
                        "key": "SupportEmail"
                    }];

                    deferred.resolve(settings);
                    localStorage.setItem('settings', JSON.stringify(settings));
                };

                function getFacebookProfile(authToken) {
                    var deferred = $q.defer();
                    $http.get(GRAPH_API_URL + '&access_token=' + authToken)
                        .success(function(data) {
                            debugger;
                            deferred.resolve(data);
                        })
                        .error(function(data, status, headers, config) {
                            // data is always undefined here when there is an error
                            debugger;
                            console.error('Error fetching feed:', data);
                        });
                    return deferred.promise;
                };
            }
        ]);
})();