module register {

    export interface IController{
        submit: () => void;
    };

    export class RegisterController implements register.IController{
        public email: string;
        public password: string;
        public passwordConfirm: string;

        //http: ng.IHttpService;
        $scope: ng.IScope;
        $rootScope: ng.IScope;
        notification: services.NotificationService;
        //AuthToken: services.AuthToken;
        $auth;
        state: ng.ui.IStateService;

        constructor($rootScope: ng.IScope, $scope:ng.IScope, NotificationService: services.NotificationService,
            $auth, $state:ng.ui.IStateService) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.notification = NotificationService;
            this.$auth= $auth;
            this.state = $state;

            this.password = "";
            this.passwordConfirm = "";

            this.$scope.$watch(() => this.password, this.checkPasswords);
            this.$scope.$watch(() => this.passwordConfirm, this.checkPasswords);

            console.log("RegisterController: Constructor");
        }

        checkPasswords = () => {
            //console.log("password or confirm changed");
            //console.log("this.$scope:" + this.$scope);
            //console.log("this.$scope['register']:" + this.$scope["register"]["password_confirm"]);
            this.$scope["register"]["password_confirm"].$setValidity("equal", (this.password === this.passwordConfirm));
        }

        submit = () => {
            this.$auth.signup({ email: this.email, password: this.password })
                .then((resp:any) => { 
                    //console.log("registration is fine!"); 
                    
                    var msg = "Dear '"+ resp.data.user.email +"' you are now registered!. Goes in your mailbox to confirm your email address within 12 hours.";
                    this.notification.success(msg); 
                    //this.AuthToken.setToken(resp.token);
                    this.$scope.$broadcast("userupdated");
                    this.state.go("main");
                })
                .catch((err) => {
                    console.log("bad");
                    this.notification.error("Error registering!" + JSON.stringify( err));
                    this.$scope.$broadcast("userupdated");
                }); 
        };
    }
}

app.controller("RegisterController", register.RegisterController);