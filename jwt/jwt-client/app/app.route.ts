'use strict';

module route {
    app.config(function ($urlRouterProvider, $stateProvider: ng.ui.IStateProvider, $httpProvider: ng.IHttpProvider) {

        $urlRouterProvider.otherwise('/')

        $stateProvider
            .state('main', {
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
    })

} 