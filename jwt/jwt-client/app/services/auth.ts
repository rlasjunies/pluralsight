"use strict";

module services {
    export class Auth {
        private http: ng.IHttpService;
        private API_URL: string;
        private AuthToken: services.AuthToken;
        private Window: ng.IWindowService;
        constructor($http: ng.IHttpService, API_URL: string, AuthToken: services.AuthToken, $window: ng.IWindowService) {
            this.http = $http;
            this.API_URL = API_URL;
            this.AuthToken = AuthToken;
            this.Window = $window;
            console.log("AuthService ... loaded");
        }

        public login = (email, password) => {
            return this.http.post(this.API_URL + "/login", { email: email, password: password })
                .success(this.success);
        };

        public register = (email, password) => {
            return this.http.post(this.API_URL + "/register", { email: email, password: password })
                .success(this.success);
        };

        public googleAuth = () => {
            var urlBuilder: string[] = [];
            urlBuilder.push(
                "response_type=code",
                "client_id=149876745472-k3ubq3pbtll17pmuohdjfom0fpinklmc.apps.googleusercontent.com",
                "redirect_uri=" + this.Window.location.origin,
                "scope=profile email");
            var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join("&");

            var options = "width=500, height=500, left=" + (this.Window.outerWidth - 500) / 2 + ", top=" + (this.Window.outerHeight - 500) /2;

            var popup = this.Window.open(url, '', options);
            this.Window.focus(); // this.Window.focus();

            this.Window.addEventListener("message", (event: MessageEvent) => {
                if (event.origin === this.Window.location.origin) {
                    console.log("We received a message from Google ..." + event.data);

                    var code = event.data;
                    popup.close();

                    this.http.post(this.API_URL + "/authgoogle", { "code": code})
                        .success((response) => {
                            console.log("success message from server");
                        })
                        .error((err) => {
                            console.log("success message from server");
                        });
                    //popup.removeEventListener("message", null);
                    //popup = null;
                }
                    
            });
        }

//#region private functions
        private success = (response:any) => {
            this.AuthToken.setToken(response.token);
        }
    }
//#endregion

}

app.factory("Auth", ($http, API_URL: string, AuthToken: services.AuthToken, $window) => {
    return new services.Auth($http, API_URL, AuthToken,$window);
});