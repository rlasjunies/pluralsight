
module logout {

    export class LogoutController {
        rootScope: ng.IScope;
        $auth: any;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, $auth, $state: ng.ui.IStateService,
            NotificationService: services.NotificationService) {
            this.rootScope = $rootScope;
            this.$auth= $auth;
            this.state = $state;
            console.log("LogoutController: Constructor");

            this.$auth.logout();
            this.rootScope.$broadcast("userupdated");
            this.state.go("main");

            NotificationService.info("You are now logout!","Authentication message");

        }
    }
}

app.controller("LogoutController", logout.LogoutController);