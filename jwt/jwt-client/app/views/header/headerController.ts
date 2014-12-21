
module header {

    export class HeaderController {
        public isAuthenticated: boolean;
        public AuthToken: services.AuthToken;

        constructor($scope: ng.IScope, AuthToken: services.AuthToken) {
            this.AuthToken = AuthToken;
            this.isAuthenticated = this.AuthToken.isAuthenticated();
            console.log("HeaderController: Constructor");

            $scope.$on("userupdated", (event: ng.IAngularEvent) => {
                this.isAuthenticated = this.AuthToken.isAuthenticated();
            });

        }
    }
}

app.controller("HeaderController", header.HeaderController);