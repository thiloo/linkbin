linkbinApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'frontPageListView'
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
            templateUrl: 'pages/home.html',
            controller: 'userView'
        })
        .when('/favorites', {
            templateUrl: 'pages/home.html',
            controller: 'favorites'
        });
});
