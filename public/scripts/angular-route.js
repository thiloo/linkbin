linkbinApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'frontPageListView'
        })
        .when('/:id', {
            templateUrl: 'pages/single.html',
            controller: 'singleLinkView'
        })
        .when('/login/login', {
            templateUrl: 'pages/login.html',
            controller: 'RegisterCtrl'
        });
});
