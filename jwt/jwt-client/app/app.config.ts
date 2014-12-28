
app.constant("API_URL", "http://localhost:3000/api");
app.constant("AUTH_URL", "http://localhost:3000/auth");

app.config(($authProvider, AUTH_URL) => {

    $authProvider.google({
        clientId: "149876745472-k3ubq3pbtll17pmuohdjfom0fpinklmc.apps.googleusercontent.com",
        url: AUTH_URL + '/google',
    });

    $authProvider.facebook({
        clientId: "1608138689408302",
        url: AUTH_URL + '/facebook',    
    });

    $authProvider.loginUrl = AUTH_URL + '/login';
    $authProvider.signupUrl = AUTH_URL + '/register';
});