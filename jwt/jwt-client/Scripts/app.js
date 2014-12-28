"use strict";
var app = angular.module("app", ['ui.router', 'satellizer']);
'use strict';
var route;
(function (route) {
    app.config(function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider) {
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
app.constant("AUTH_URL", "http://localhost:3000/auth");
app.config(function ($authProvider, AUTH_URL) {
    $authProvider.google({
        clientId: "149876745472-k3ubq3pbtll17pmuohdjfom0fpinklmc.apps.googleusercontent.com",
        url: AUTH_URL + '/google',
    });
    $authProvider.facebook({
        clientId: "1608138689408302",
        url: AUTH_URL + '/facebook',
    });
    $authProvider.loginUrl = AUTH_URL + '/login';
    $authProvider.signupUrl = AUTH_URL + '/register';
});
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
        function RegisterController($rootScope, $scope, NotificationService, $auth, $state) {
            var _this = this;
            this.checkPasswords = function () {
                _this.$scope["register"]["password_confirm"].$setValidity("equal", (_this.password === _this.passwordConfirm));
            };
            this.submit = function () {
                _this.$auth.signup({ email: _this.email, password: _this.password }).then(function (resp) {
                    var msg = "Dear '" + resp.data.user.email + "' you are now registered!. Goes in your mailbox to confirm your email address within 12 hours.";
                    _this.notification.success(msg);
                    _this.$scope.$broadcast("userupdated");
                    _this.state.go("main");
                }).catch(function (err) {
                    console.log("bad");
                    _this.notification.error("Error registering!" + JSON.stringify(err));
                    _this.$scope.$broadcast("userupdated");
                });
            };
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.notification = NotificationService;
            this.$auth = $auth;
            this.state = $state;
            this.password = "";
            this.passwordConfirm = "";
            this.$scope.$watch(function () { return _this.password; }, this.checkPasswords);
            this.$scope.$watch(function () { return _this.passwordConfirm; }, this.checkPasswords);
            console.log("RegisterController: Constructor");
        }
        return RegisterController;
    })();
    register.RegisterController = RegisterController;
})(register || (register = {}));
app.controller("RegisterController", register.RegisterController);
'use strict';
var register;
(function (register) {
    var ValidateEqualsDirective = (function () {
        function ValidateEqualsDirective() {
            this.require = "ngModel";
            this.link = function (scope, instanceElement, attrs, controller) {
                function validateEqual(value) {
                    console.log("validateEqual-value:" + value);
                    console.log("validateEqual-scope.$eval(attrs['controllerValidateEquals'])):" + scope.$eval(attrs["controllerValidateEquals"]));
                    var valid = (value === scope.$eval(attrs["controllerValidateEquals"]));
                    console.log("isValid?:" + valid);
                    return valid ? value : undefined;
                }
                ;
                controller.$parsers.push(validateEqual);
                controller.$formatters.push(validateEqual);
                scope.$watch(attrs["controllerValidateEquals"], function () {
                    console.log("scope.$watch of - val of ctlr.password:" + scope.$eval(attrs["controllerValidateEquals"]));
                    console.log("scope.$watch of - val of confirmPassword", controller.$viewValue);
                    if (controller.$viewValue === scope.$eval(attrs["controllerValidateEquals"])) {
                        controller.$setValidity("equal", true);
                    }
                    else {
                        controller.$setValidity("equal", false);
                    }
                });
            };
        }
        return ValidateEqualsDirective;
    })();
    register.ValidateEqualsDirective = ValidateEqualsDirective;
})(register || (register = {}));
app.directive("x", function () {
    return new register.ValidateEqualsDirective();
});
var header;
(function (header) {
    var HeaderController = (function () {
        function HeaderController($scope, $auth) {
            var _this = this;
            this.$auth = $auth;
            this.isAuthenticated = this.$auth.isAuthenticated();
            console.log("HeaderController: Constructor");
            $scope.$on("userupdated", function (event) {
                _this.isAuthenticated = _this.$auth.isAuthenticated();
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
        function LogoutController($rootScope, $auth, $state, NotificationService) {
            this.rootScope = $rootScope;
            this.$auth = $auth;
            this.state = $state;
            console.log("LogoutController: Constructor");
            this.$auth.logout();
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
        function LoginController($rootScope, NotificationService, $state, $auth) {
            var _this = this;
            this.submit = function () {
                _this.$auth.login({ email: _this.email, password: _this.password }).then(function (response) {
                    var msg = "Thanks '" + response.data.user.email + "'for coming back!";
                    _this.notification.success(msg);
                    if (!response.data.user.active) {
                        msg = "Do not forget to active your account via the email sent!";
                        _this.notification.warning(msg);
                    }
                    _this.rootScope.$broadcast("userupdated");
                    _this.state.go("main");
                }).catch(function (err) {
                    console.log("login:" + JSON.stringify(err));
                    _this.notification.error("Error registering!");
                    _this.rootScope.$broadcast("userupdated");
                });
            };
            this.authenticate = function (provider) {
                _this.$auth.authenticate(provider).then(function () {
                    console.log("login is fine!");
                    _this.notification.success("U are logged!");
                    _this.rootScope.$broadcast("userupdated");
                    _this.state.go("main");
                }).catch(function (err) {
                    console.log("login:" + JSON.stringify(err));
                    _this.notification.error("Error registering!");
                    _this.rootScope.$broadcast("userupdated");
                });
            };
            this.rootScope = $rootScope;
            this.notification = NotificationService;
            this.$auth = $auth;
            this.state = $state;
            console.log("LoginController: Constructor");
        }
        return LoginController;
    })();
    login.LoginController = LoginController;
})(login || (login = {}));
app.controller("LoginController", login.LoginController);
//# sourceMappingURL=app.js.map