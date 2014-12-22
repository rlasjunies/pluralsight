interface Location {
    origin: string;
}
declare var app: ng.IModule;
declare module route {
}
declare module services {
    class NotificationService {
        success(message: string, title?: string): void;
        error(message: string, title?: string): void;
        info(message: string, title?: string): void;
        warning(message: string, title?: string): void;
        constructor();
    }
}
declare module services {
    class AuthToken {
        storage: Storage;
        cachedToken: string;
        constructor($window: ng.IWindowService);
        setToken: (token: string) => void;
        getToken: () => string;
        remove: () => void;
        isAuthenticated: () => boolean;
    }
}
declare module services {
    class AuthInterceptor {
        AuthToken: AuthToken;
        constructor(AuthToken: AuthToken);
        request: (config: any) => any;
        response: (response: any) => any;
    }
}
declare module services {
    class Auth {
        private http;
        private API_URL;
        private AuthToken;
        private Window;
        constructor($http: ng.IHttpService, API_URL: string, AuthToken: AuthToken, $window: ng.IWindowService);
        login: (email: any, password: any) => ng.IHttpPromise<{}>;
        register: (email: any, password: any) => ng.IHttpPromise<{}>;
        googleAuth: () => void;
        private success;
    }
}
declare module register {
    interface IController {
        submit: () => void;
    }
    class RegisterController implements IController {
        email: string;
        password: string;
        scope: ng.IScope;
        notification: services.NotificationService;
        Auth: services.Auth;
        state: ng.ui.IStateService;
        constructor($rootScope: ng.IScope, NotificationService: services.NotificationService, Auth: services.Auth, $state: ng.ui.IStateService);
        submit: () => void;
    }
}
declare module register {
    class ValidateEqualsDirective implements ng.IDirective {
        require: string;
        link: (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: ng.INgModelController, transclude: ng.ITranscludeFunction) => void;
    }
}
declare module header {
    class HeaderController {
        isAuthenticated: boolean;
        AuthToken: services.AuthToken;
        constructor($scope: ng.IScope, AuthToken: services.AuthToken);
    }
}
declare module jobs {
    interface job {
        name: string;
    }
    class JobsController {
        jobs: job[];
        notificationService: services.NotificationService;
        constructor($scope: ng.IScope, $http: ng.IHttpService, API_URL: any, NotificationService: services.NotificationService);
    }
}
declare module logout {
    class LogoutController {
        rootScope: ng.IScope;
        AuthToken: services.AuthToken;
        state: ng.ui.IStateService;
        constructor($rootScope: ng.IScope, AuthToken: services.AuthToken, $state: ng.ui.IStateService, NotificationService: services.NotificationService);
    }
}
declare module app_ {
    class AppController {
        isAuthenticated: boolean;
        AuthToken: services.AuthToken;
        constructor($rootScope: ng.IScope, AuthToken: services.AuthToken);
    }
}
declare module login {
    interface ILogin {
        submit: () => void;
    }
    class LoginController implements register.IController {
        email: string;
        password: string;
        rootScope: ng.IScope;
        notification: services.NotificationService;
        auth: services.Auth;
        state: ng.ui.IStateService;
        constructor($rootScope: ng.IScope, NotificationService: services.NotificationService, Auth: services.Auth, $state: ng.ui.IStateService);
        submit: () => void;
        google: () => void;
    }
}
