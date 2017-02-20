(function() {
    'use strict';

    angular
        .module('lappweb')
        .factory('AuthFactory', function Auth($location, $rootScope, $http, $cookies, $q, RESOURCE_API, RESOURCE_API_TOKEN) {

            var currentUser = {},
                authServiceFactory = {},
                clientId = "ef4151a8-4809-4fdc-94c3-623dc45367f7",
                _this = this;

            /*if ($cookies.get('token')) {
                currentUser = User.get();
            }*/

            var authentication = {
                isAuth: false,
                userName: "",
                useRefreshTokens: false
            };
            var externalAuthData = {
                provider: "",
                userName: "",
                externalAccessToken: ""
            };
            var saveRegistration = function(registration) {

                logout();

                return $http.post(RESOURCE_API + '/api/Clients', registration).then(function(response) {
                    debugger;
                    return response;
                });

            };
            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            var login = function(loginData) {
                var deferred = $q.defer();
                $http.get(RESOURCE_API + "api/Clients/existing/" + encodeURIComponent(loginData.userName) + "/" + encodeURIComponent(loginData.password)).
                success(function(response) {
                    //$cookies.putObject("authorizationData");
                    authentication.isAuth = true;
                    authentication.userName = loginData.userName;
                    authentication.useRefreshTokens = loginData.useRefreshTokens;
                    response.logged = true;
                    $cookies.putObject("client", response);
                    deferred.resolve(response);
                }).
                error(function(err) {
                    debugger;
                    //logout();
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            /**
             * Delete access token and user info
             *
             * @param  {Function}
             */
            var logout = function() {
                $cookies.putObject("client", null);
                $cookies.getObject("fb", null);
                currentUser = {};
                authentication.isAuth = false;
                authentication.userName = "";
                authentication.useRefreshTokens = false;
            };

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            var createUser = function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(data) {
                        $cookies.put('token', data.token);
                        currentUser = User.get();
                        return cb(user);
                    },
                    function(err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            };

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            var changePassword = function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return User.changePassword({ id: currentUser._id }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            };

            /**
             * Gets all available info on authenticated user
             *
             * @return {Object} user
             */
            var getCurrentUser = function() {
                return currentUser;
            };

            /**
             * Check if a user is logged in
             *
             * @return {Boolean}
             */
            var isLoggedIn = function() {
                return currentUser.hasOwnProperty('role');
            };

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            var isLoggedInAsync = function(cb) {
                if (currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } else if (currentUser.hasOwnProperty('role')) {
                    cb(true);
                } else {
                    cb(false);
                }
            };

            /**
             * Check if a user is an admin
             *
             * @return {Boolean}
             */
            var isAdmin = function() {
                return currentUser.role === 'admin';
            };

            /**
             * Get auth token
             */
            var getToken = function() {
                return $cookies.get('token');
            };

            var fillAuthData = function() {
                try {
                    var authData = $cookies.getObject("authorizationData");
                } catch (err) {}

                if (authData) {
                    authentication.isAuth = true;
                    authentication.userName = authData.userName;
                    authentication.useRefreshTokens = authData.useRefreshTokens;
                }
            };

            var obtainAccessToken = function() {
                var deferred = $q.defer();
                //$http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function(response) {
                $http({
                    url: RESOURCE_API_TOKEN,
                    method: 'POST',
                    data: "&Scope=" + encodeURIComponent("website") +
                        "&grant_type=" + encodeURIComponent("client_credentials") +
                        "&client_secret=" + encodeURIComponent("123@abc") +
                        "&client_id=" + encodeURIComponent(clientId),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function(response) {
                    var authorizationData = {
                        token: response.access_token,
                        userName: "",
                        refreshToken: "",
                        useRefreshTokens: false
                    };
                    $cookies.putObject("authorizationData", authorizationData);
                    authentication.isAuth = true;
                    authentication.userName = "";
                    authentication.useRefreshTokens = false;

                    deferred.resolve(response);

                }).error(function(err, status) {
                    logout();
                    deferred.reject(err);
                });
                return deferred.promise;
            };

            var refreshToken = function() {
                var deferred = $q.defer();
                try {
                    var authData = $cookies.getObject("authorizationData");
                } catch (err) {

                }

                if (authData) {

                    if (authData.useRefreshTokens) {

                        var _data = "&grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + clientId;


                        //serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                        $http.post({
                            url: RESOURCE_API_TOKEN,
                            method: 'POST',
                            data: _data,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }).success(function(response) {
                            var authorizationData = {
                                token: response.access_token,
                                userName: response.userName,
                                refreshToken: response.refresh_token,
                                useRefreshTokens: true
                            };
                            $cookies.putObject("authorizationData", authorizationData);
                            deferred.resolve(response);
                        }).error(function(err, status) {
                            logout();
                            deferred.reject(err);
                        });
                    }
                }
                return deferred.promise;
            };

            var registerExternal = function(registerExternalData) {
                /*
                var deferred = $q.defer();

                $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function(response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                    _authentication.isAuth = true;
                    _authentication.userName = response.userName;
                    _authentication.useRefreshTokens = false;

                    deferred.resolve(response);

                }).error(function(err, status) {
                    _logout();
                    deferred.reject(err);
                });

                return deferred.promise;
                */
            };

            authServiceFactory.authentication = authentication;
            authServiceFactory.externalAuthData = externalAuthData;
            authServiceFactory.saveRegistration = saveRegistration;
            authServiceFactory.login = login;
            authServiceFactory.logout = logout;
            authServiceFactory.createUser = createUser;
            authServiceFactory.changePassword = changePassword;
            authServiceFactory.getCurrentUser = getCurrentUser;
            authServiceFactory.isLoggedIn = isLoggedIn;
            authServiceFactory.isLoggedInAsync = isLoggedInAsync;
            authServiceFactory.isAdmin = isAdmin;
            authServiceFactory.getToken = getToken;
            authServiceFactory.obtainAccessToken = obtainAccessToken;
            authServiceFactory.fillAuthData = fillAuthData;
            authServiceFactory.refreshToken = refreshToken;
            //authServiceFactory.registerExternal = registerExternal;

            return authServiceFactory;
        });
})();