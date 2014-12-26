
module login {

    export interface ILogin{
        submit: () => void;
    };

    export class LoginController implements register.IController{
        public email: string;
        public password: string;

        rootScope: ng.IScope;
        notification: services.NotificationService;
        auth: services.Auth;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, NotificationService: services.NotificationService,
            Auth: services.Auth, $state:ng.ui.IStateService) {
            this.rootScope = $rootScope;
            this.notification = NotificationService;
            this.auth= Auth;
            this.state = $state;
            console.log("LoginController: Constructor");
        }

        submit = () => {
            this.auth.login(this.email, this.password)
                .success((response) => {
                    console.log("login is fine!");
                    this.notification.success("U are logged!");
                    this.rootScope.$broadcast("userupdated");
                    this.state.go("main");
                })
                .error((err) => {
                    console.log("login:" + JSON.stringify(err));
                    this.notification.error("Error registering!");
                    this.rootScope.$broadcast("userupdated");
                }); 
            
        }
        google = () => {
            this.auth.googleAuth().then((resp) => {
                console.log("login is fine!");
                this.notification.success("U are logged!");
                this.rootScope.$broadcast("userupdated");
                this.state.go("main");
            }, (err) => {
                    console.log("login:" + JSON.stringify(err));
                    this.notification.error("Error registering!");
                    this.rootScope.$broadcast("userupdated");
                } );
        };
    }
}

app.controller("LoginController", login.LoginController);