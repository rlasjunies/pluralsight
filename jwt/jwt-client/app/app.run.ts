app.run(($window: ng.IWindowService) => {
    var params = $window.location.search.substring(1);

    console.log("run:" + $window.location.search);

    if (params && $window.opener && ($window.opener.location.origin === $window.location.origin)) {
        var pair = params.split("=");
        var code = decodeURIComponent(pair[1]);

        $window.opener.postMessage(code, $window.location.origin);
    }

});