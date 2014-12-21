
module logout {

    export class LogoutController {
        rootScope: ng.IScope;
        AuthToken: services.AuthToken;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, AuthToken: services.AuthToken, $state: ng.ui.IStateService,
            NotificationService: services.NotificationService) {
            this.rootScope = $rootScope;
            this.AuthToken = AuthToken;
            this.state = $state;
            console.log("LogoutController: Constructor");

            this.AuthToken.remove();
            this.rootScope.$broadcast("userupdated");
            this.state.go("main");

            NotificationService.info("You are now logout!","Authentication message");

        }
    }
}

app.controller("LogoutController", logout.LogoutController);