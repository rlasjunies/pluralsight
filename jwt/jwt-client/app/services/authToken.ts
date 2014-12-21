﻿"use strict";
module services {

    var CST_KEY : string = "TOKEN";
    export class AuthToken {
        storage : Storage;
        cachedToken: string;
        constructor($window: ng.IWindowService) {
            this.storage = $window.localStorage;
            console.log("notificationService ... loaded");
        }

        setToken = (token: string): void => {
            this.cachedToken = token;
            this.storage.setItem(CST_KEY, token);
        }

        getToken = (): string => {
            if(!this.cachedToken)
                this.cachedToken = this.storage.getItem(CST_KEY);
            return this.cachedToken
        }

        remove = (): void => {
            this.cachedToken = null;
            this.storage.removeItem(CST_KEY);
        }

        isAuthenticated = (): boolean => {
            if (this.getToken() === null)
                return false;
            return true;
        }

    }
}

app.factory("AuthToken", ($window) => {
    return new services.AuthToken( $window );
});