"use strict";
var app = angular.module("app", ['ui.router']);
'use strict';
var route;
(function (route) {
    app.config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('main', {
            url: '/',
            templateUrl: 'views/main/main.html'
        }).state('register', {
            url: '/register',
            templateUrl: 'views/register/register.html',
            controller: "RegisterController",
            controllerAs: "ctlr"
        }).state('logout', {
            url: '/logout',
            controller: "LogoutController",
            controllerAs: "ctlr"
        }).state('login', {
            url: '/login',
            templateUrl: 'views/login/login.html',
            controller: "LoginController",
            controllerAs: "loginctlr"
        }).state('jobs', {
            url: '/jobs',
            templateUrl: 'views/jobs/jobs.html',
            controller: "JobsController",
            controllerAs: "jobsctlr"
        });
        $httpProvider.interceptors.push("AuthInterceptor");
    });
})(route || (route = {}));
app.constant("API_URL", "http://localhost:3000/api");
app.run(function ($window) {
    var params = $window.location.search.substring(1);
    console.log("run:" + $window.location.search);
    if (params && $window.opener && ($window.opener.location.origin === $window.location.origin)) {
        var pair = params.split("=");
        var code = decodeURIComponent(pair[1]);
        $window.opener.postMessage(code, $window.location.origin);
    }
});
"use strict";
var services;
(function (services) {
    var NotificationService = (function () {
        function NotificationService() {
            console.log("notificationService ... loaded");
            toastr.options = {
                "positionClass": "toast-bottom-right",
            };
        }
        NotificationService.prototype.success = function (message, title) {
            if (title === undefined)
                title = "";
            toastr.success(message, title);
        };
        NotificationService.prototype.error = function (message, title) {
            if (title === undefined)
                title = "";
            toastr.error(message, title);
        };
        NotificationService.prototype.info = function (message, title) {
            if (title === undefined)
                title = "";
            toastr.info(message, title);
        };
        NotificationService.prototype.warning = function (message, title) {
            if (title === undefined)
                title = "";
            toastr.warning(message, title);
        };
        return NotificationService;
    })();
    services.NotificationService = NotificationService;
})(services || (services = {}));
app.factory("NotificationService", function () {
    return new services.NotificationService();
});
"use strict";
var services;
(function (services) {
    var CST_KEY = "TOKEN";
    var AuthToken = (function () {
        function AuthToken($window) {
            var _this = this;
            this.setToken = function (token) {
                _this.cachedToken = token;
                _this.storage.setItem(CST_KEY, token);
            };
            this.getToken = function () {
                if (!_this.cachedToken)
                    _this.cachedToken = _this.storage.getItem(CST_KEY);
                return _this.cachedToken;
            };
            this.remove = function () {
                _this.cachedToken = null;
                _this.storage.removeItem(CST_KEY);
            };
            this.isAuthenticated = function () {
                if (_this.getToken() === null)
                    return false;
                return true;
            };
            this.storage = $window.localStorage;
            console.log("notificationService ... loaded");
        }
        return AuthToken;
    })();
    services.AuthToken = AuthToken;
})(services || (services = {}));
app.factory("AuthToken", function ($window) {
    return new services.AuthToken($window);
});
'use strict';
var services;
(function (services) {
    var AuthInterceptor = (function () {
        function AuthInterceptor(AuthToken) {
            var _this = this;
            this.request = function (config) {
                var token = _this.AuthToken.getToken();
                if (token)
                    config.headers.Authorization = "Bearer " + token;
                return config;
            };
            this.response = function (response) {
                return response;
            };
            this.AuthToken = AuthToken;
        }
        return AuthInterceptor;
    })();
    services.AuthInterceptor = AuthInterceptor;
})(services || (services = {}));
app.factory("AuthInterceptor", function (AuthToken) {
    return new services.AuthInterceptor(AuthToken);
});
"use strict";
var services;
(function (services) {
    var Auth = (function () {
        function Auth($http, API_URL, AuthToken, $window, $q) {
            var _this = this;
            this.login = function (email, password) {
                return _this.$http.post(_this.API_URL + "/login", { email: email, password: password }).success(_this.success);
            };
            this.register = function (email, password) {
                return _this.$http.post(_this.API_URL + "/register", { email: email, password: password }).success(_this.success);
            };
            this.googleAuth = function () {
                var urlBuilder = [];
                var clientId = "149876745472-k3ubq3pbtll17pmuohdjfom0fpinklmc.apps.googleusercontent.com";
                urlBuilder.push("response_type=code", "client_id=" + clientId, "redirect_uri=" + _this.$window.location.origin, "scope=profile email");
                var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join("&");
                var options = "width=500, height=500, left=" + (_this.$window.outerWidth - 500) / 2 + ", top=" + (_this.$window.outerHeight - 500) / 2;
                var defered = _this.$q.defer();
                var popup = _this.$window.open(url, '', options);
                _this.$window.focus();
                var onGoogleAuthCode = function (event) {
                    if (event.origin === _this.$window.location.origin) {
                        console.log("We received a message from Google ..." + event.data);
                        var code = event.data;
                        popup.close();
                        _this.$http.post(_this.API_URL + "/authgoogle", {
                            code: code,
                            clientId: clientId,
                            redirectUri: _this.$window.location.origin
                        }).success(function (jwt) {
                            console.log("success message from server");
                            _this.success(jwt);
                            defered.resolve(jwt);
                        }).error(function (err) {
                            console.log("success message from server");
                        });
                        _this.$window.removeEventListener("message", onGoogleAuthCode);
                    }
                };
                _this.$window.addEventListener("message", onGoogleAuthCode);
                return defered.promise;
            };
            this.success = function (response) {
                _this.AuthToken.setToken(response.token);
            };
            this.$http = $http;
            this.$q = $q;
            this.API_URL = API_URL;
            this.AuthToken = AuthToken;
            this.$window = $window;
            console.log("AuthService ... loaded");
        }
        return Auth;
    })();
    services.Auth = Auth;
})(services || (services = {}));
app.factory("Auth", function ($http, API_URL, AuthToken, $window, $q) {
    return new services.Auth($http, API_URL, AuthToken, $window, $q);
});
var register;
(function (register) {
    ;
    var RegisterController = (function () {
        function RegisterController($rootScope, NotificationService, Auth, $state) {
            var _this = this;
            this.submit = function () {
                _this.Auth.register(_this.email, _this.password).success(function (resp) {
                    console.log("registration is fine!");
                    _this.notification.success("U are registered!");
                    _this.scope.$broadcast("userupdated");
                    _this.state.go("main");
                }).error(function (err) {
                    console.log("bad");
                    _this.notification.error("Error registering!");
                    _this.scope.$broadcast("userupdated");
                });
            };
            this.scope = $rootScope;
            this.notification = NotificationService;
            this.Auth = Auth;
            this.state = $state;
            console.log("RegisterController: Constructor");
        }
        return RegisterController;
    })();
    register.RegisterController = RegisterController;
})(register || (register = {}));
app.controller("RegisterController", register.RegisterController);
var register;
(function (register) {
    var ValidateEqualsDirective = (function () {
        function ValidateEqualsDirective() {
            this.require = "ngModel";
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                function validateEqual(value) {
                    var valid = (value === scope.$eval(instanceAttributes["validateEquals"]));
                    controller.$setValidity("equal", valid);
                    return valid ? value : undefined;
                }
                ;
                controller.$parsers.push(validateEqual);
                controller.$formatters.push(validateEqual);
                scope.$watch(instanceAttributes["validateEquals"], function () {
                    controller.$setViewValue(controller.$viewValue);
                });
            };
        }
        return ValidateEqualsDirective;
    })();
    register.ValidateEqualsDirective = ValidateEqualsDirective;
})(register || (register = {}));
app.directive("validateEquals", function () {
    return new register.ValidateEqualsDirective();
});
var header;
(function (header) {
    var HeaderController = (function () {
        function HeaderController($scope, AuthToken) {
            var _this = this;
            this.AuthToken = AuthToken;
            this.isAuthenticated = this.AuthToken.isAuthenticated();
            console.log("HeaderController: Constructor");
            $scope.$on("userupdated", function (event) {
                _this.isAuthenticated = _this.AuthToken.isAuthenticated();
            });
        }
        return HeaderController;
    })();
    header.HeaderController = HeaderController;
})(header || (header = {}));
app.controller("HeaderController", header.HeaderController);
var jobs;
(function (_jobs) {
    var JobsController = (function () {
        function JobsController($scope, $http, API_URL, NotificationService) {
            var _this = this;
            this.jobs = [];
            this.notificationService = NotificationService;
            $http.get(API_URL + "/jobs").error(function (err) {
                _this.notificationService.error("Error message: \n" + JSON.stringify(err), "Cannot load jobs resources:");
            }).success(function (jobs) {
                _this.jobs = jobs;
            });
            console.log("JobsController: Constructor");
            console.log(JSON.stringify(this.jobs));
        }
        return JobsController;
    })();
    _jobs.JobsController = JobsController;
})(jobs || (jobs = {}));
app.controller("JobsController", jobs.JobsController);
var logout;
(function (logout) {
    var LogoutController = (function () {
        function LogoutController($rootScope, AuthToken, $state, NotificationService) {
            this.rootScope = $rootScope;
            this.AuthToken = AuthToken;
            this.state = $state;
            console.log("LogoutController: Constructor");
            this.AuthToken.remove();
            this.rootScope.$broadcast("userupdated");
            this.state.go("main");
            NotificationService.info("You are now logout!", "Authentication message");
        }
        return LogoutController;
    })();
    logout.LogoutController = LogoutController;
})(logout || (logout = {}));
app.controller("LogoutController", logout.LogoutController);
var app_;
(function (app_) {
    var AppController = (function () {
        function AppController($rootScope, AuthToken) {
            this.AuthToken = AuthToken;
            this.isAuthenticated = this.AuthToken.isAuthenticated();
            console.log("HeaderController: Constructor");
        }
        return AppController;
    })();
    app_.AppController = AppController;
})(app_ || (app_ = {}));
app.controller("AppController", app_.AppController);
var login;
(function (login) {
    ;
    var LoginController = (function () {
        function LoginController($rootScope, NotificationService, Auth, $state) {
            var _this = this;
            this.submit = function () {
                _this.auth.login(_this.email, _this.password).success(function (response) {
                    console.log("login is fine!");
                    _this.notification.success("U are logged!");
                    _this.rootScope.$broadcast("userupdated");
                    _this.state.go("main");
                }).error(function (err) {
                    console.log("login:" + JSON.stringify(err));
                    _this.notification.error("Error registering!");
                    _this.rootScope.$broadcast("userupdated");
                });
            };
            this.google = function () {
                _this.auth.googleAuth().then(function (resp) {
                    console.log("login is fine!");
                    _this.notification.success("U are logged!");
                    _this.rootScope.$broadcast("userupdated");
                    _this.state.go("main");
                }, function (err) {
                    console.log("login:" + JSON.stringify(err));
                    _this.notification.error("Error registering!");
                    _this.rootScope.$broadcast("userupdated");
                });
            };
            this.rootScope = $rootScope;
            this.notification = NotificationService;
            this.auth = Auth;
            this.state = $state;
            console.log("LoginController: Constructor");
        }
        return LoginController;
    })();
    login.LoginController = LoginController;
})(login || (login = {}));
app.controller("LoginController", login.LoginController);
//# sourceMappingURL=app.js.map