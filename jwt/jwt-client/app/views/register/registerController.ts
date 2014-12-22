
module register {

    export interface IController{
        submit: () => void;
    };

    export class RegisterController implements register.IController{
        public email: string;
        public password: string;

        //http: ng.IHttpService;
        scope: ng.IScope;
        notification: services.NotificationService;
        //AuthToken: services.AuthToken;
        Auth: services.Auth;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, NotificationService: services.NotificationService,
            Auth: services.Auth, $state:ng.ui.IStateService) {
            this.scope = $rootScope;
            //this.http = $http;
            this.notification = NotificationService;
            this.Auth= Auth;
            this.state = $state;
            console.log("RegisterController: Constructor");
        }

        submit = () => {
            //var url = "/api/register";
            //var user = {
            //    email: this.email,
            //    password: this.password
            //};
            this.Auth.register(this.email, this.password)
                .success((resp:any) => {
                    console.log("registration is fine!");
                    this.notification.success("U are registered!");
                    //this.AuthToken.setToken(resp.token);
                    this.scope.$broadcast("userupdated");
                    this.state.go("main");
                })
                .error((err) => {
                    console.log("bad");
                    this.notification.error("Error registering!");
                    this.scope.$broadcast("userupdated");
                }); 
        };
    }
}

app.controller("RegisterController", register.RegisterController);