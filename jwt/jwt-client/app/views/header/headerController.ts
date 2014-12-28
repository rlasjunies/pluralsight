
module header {

    export class HeaderController {
        public isAuthenticated: boolean;
        public $auth: any; //: services.AuthToken;

        constructor($scope: ng.IScope, $auth) {
            this.$auth = $auth;
            this.isAuthenticated = this.$auth.isAuthenticated();
            console.log("HeaderController: Constructor");

            $scope.$on("userupdated", (event: ng.IAngularEvent) => {
                this.isAuthenticated = this.$auth.isAuthenticated();
            });

        }
    }
}

app.controller("HeaderController", header.HeaderController);