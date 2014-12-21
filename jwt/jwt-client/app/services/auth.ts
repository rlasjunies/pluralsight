"use strict";
module services {

    export class Auth {
        private http: ng.IHttpService;
        private API_URL: string;
        private AuthToken: services.AuthToken;
        constructor($http: ng.IHttpService, API_URL: string, AuthToken: services.AuthToken) {
            this.http = $http;
            this.API_URL = API_URL;
            this.AuthToken = AuthToken;
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

        private success = (response:any) => {
            this.AuthToken.setToken(response.token);
        }
    }
}

app.factory("Auth", ($http: ng.IHttpService, API_URL: string, AuthToken: services.AuthToken) => {
    return new services.Auth($http, API_URL, AuthToken);
});