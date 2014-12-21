'use strict';

module services {
    export class AuthInterceptor {

        AuthToken: services.AuthToken;

        constructor(AuthToken: services.AuthToken) {
            this.AuthToken = AuthToken;
        }

        request = (config) => {
            var token = this.AuthToken.getToken();

            if (token)
                config.headers.Authorization = "Bearer " + token;

            return config;
        };

        response = (response) => {
            return response;
        };
    }
}
app.factory("AuthInterceptor", (AuthToken:services.AuthToken) => {
    return new services.AuthInterceptor(AuthToken)
});