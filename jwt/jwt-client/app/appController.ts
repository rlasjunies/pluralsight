
module app_ {

    export class AppController {
        public isAuthenticated: boolean;
        public AuthToken: services.AuthToken;

        constructor($rootScope: ng.IScope, AuthToken: services.AuthToken) {
            this.AuthToken = AuthToken;
            this.isAuthenticated = this.AuthToken.isAuthenticated();
            console.log("HeaderController: Constructor");
        }


    }
}

app.controller("AppController", app_.AppController);