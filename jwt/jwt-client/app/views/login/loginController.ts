
module login {

    export interface ILogin{
        submit: () => void;
    };

    export class LoginController implements register.IController{
        public email: string;
        public password: string;

        rootScope: ng.IScope;
        notification: services.NotificationService;
        $auth: any;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, NotificationService: services.NotificationService,
            $state:ng.ui.IStateService, $auth) {
            this.rootScope = $rootScope;
            this.notification = NotificationService;
            this.$auth= $auth;
            this.state = $state;
            console.log("LoginController: Constructor");
        }

        submit = () => {
            this.$auth.login({ email: this.email, password: this.password })
                .then((response) => {
                    //console.log("login is fine!");

                    var msg = "Thanks '" + response.data.user.email + "'for coming back!"
                    this.notification.success(msg);

                    if (!response.data.user.active) {
                        msg = "Do not forget to active your account via the email sent!";
                        this.notification.warning(msg);
                    }

                    this.rootScope.$broadcast("userupdated");
                    this.state.go("main");
                })
                .catch((err) => {
                    console.log("login:" + JSON.stringify(err));
                    this.notification.error("Error registering!");
                    this.rootScope.$broadcast("userupdated");
                }); 
            
        }

        //google = () => {
        //    this.$auth.googleAuth().then((resp) => {
        //        console.log("login is fine!");
        //        this.notification.success("U are logged!");
        //        this.rootScope.$broadcast("userupdated");
        //        this.state.go("main");
        //    }, (err) => {
        //            console.log("login:" + JSON.stringify(err));
        //            this.notification.error("Error registering!");
        //            this.rootScope.$broadcast("userupdated");
        //        } );
        //};

        authenticate = (provider:string) => {
            this.$auth.authenticate(provider).then(() => {
                console.log("login is fine!");
                this.notification.success("U are logged!");
                this.rootScope.$broadcast("userupdated");
                this.state.go("main");
            }).catch((err) => {
                    console.log("login:" + JSON.stringify(err));
                    this.notification.error("Error registering!");
                    this.rootScope.$broadcast("userupdated");
                });
        };


    }
}

app.controller("LoginController", login.LoginController);