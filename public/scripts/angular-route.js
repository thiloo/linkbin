linkbinApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html'
        })
        .when('/link/:id', {
            templateUrl: 'pages/single.html',
            controller: 'singleLinkView'
        })
        .when('/login/login', {
            templateUrl: 'pages/login.html',
            controller: 'register'
        })
        .when('/add/link', {
            templateUrl: 'pages/upload.html',
            controller: 'addLink'
        })
        .when('/user/:username', {
            templateUrl: 'pages/user.html',
            controller: 'userView'
        })
});
