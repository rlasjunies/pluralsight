"use strict";

module services {
    export class Auth {
        private $http: ng.IHttpService;
        private API_URL: string;
        private AuthToken: services.AuthToken;
        private $window: ng.IWindowService;
        private $q: ng.IQService;

        constructor($http: ng.IHttpService, API_URL: string, AuthToken: services.AuthToken, $window: ng.IWindowService,$q: ng.IQService) {
            this.$http = $http;
            this.$q = $q;
            this.API_URL = API_URL;
            this.AuthToken = AuthToken;
            this.$window = $window;
            console.log("AuthService ... loaded");
        }

        public login = (email, password) => {
            return this.$http.post(this.API_URL + "/login", { email: email, password: password })
                .success(this.success);
        };

        public register = (email, password) => {
            return this.$http.post(this.API_URL + "/register", { email: email, password: password })
                .success(this.success);
        };

        //public googleAuth = ():ng.IPromise<any> => {
        //    var urlBuilder: string[] = [];
        //    var clientId = "149876745472-k3ubq3pbtll17pmuohdjfom0fpinklmc.apps.googleusercontent.com";
        //    urlBuilder.push(
        //        "response_type=code",
        //        "client_id=" + clientId,
        //        "redirect_uri=" + this.$window.location.origin,
        //        "scope=profile email");
        //    var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join("&");

        //    var options = "width=500, height=500, left=" + (this.$window.outerWidth - 500) / 2 + ", top=" + (this.$window.outerHeight - 500) /2;

        //    var defered = this.$q.defer();

        //    var popup = this.$window.open(url, '', options);
        //    this.$window.focus(); // this.Window.focus();

        //    var onGoogleAuthCode = (event: MessageEvent) => {
        //        if (event.origin === this.$window.location.origin) {
        //            console.log("We received a message from Google ..." + event.data);

        //            var code = event.data;
        //            popup.close();

        //            this.$http.post(this.API_URL + "/authgoogle", {
        //                code: code,
        //                clientId: clientId ,
        //                redirectUri: this.$window.location.origin
        //            })
        //                .success((jwt) => {
        //                    console.log("success message from server");
        //                    this.success(jwt);
        //                    defered.resolve(jwt);
        //                })
        //                .error((err) => {
        //                    console.log("success message from server");
        //                });
        //            this.$window.removeEventListener("message", onGoogleAuthCode);
        //            //popup = null;
        //        }
        //    };

        //    this.$window.addEventListener("message", onGoogleAuthCode);

        //    return defered.promise;
        //}

//#region private functions
        private success = (response:any) => {
            this.AuthToken.setToken(response.token);
        }
    }
//#endregion

}

app.factory("Auth", ($http, API_URL: string, AuthToken: services.AuthToken, $window, $q) => {
    return new services.Auth($http, API_URL, AuthToken,$window, $q);
});