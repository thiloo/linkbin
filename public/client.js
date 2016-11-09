const linkbinApp = angular.module('linkbinApp', ['ngRoute']);

linkbinApp.controller('frontPageListView', function($scope, $http) {
    $scope.load = function() {
        console.log('loading');
        $http.get('/homepage').then(function(content) {
            $scope.links = content.data.file;
            console.log(content);
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
});


linkbinApp.controller('register', function($scope, $http) {
    $scope.post = function(req){
        var register = req.body;
        var db = require('/.db.js');
        $http.post('/register')
        .then(
            db.createUser(register.username, register.password)
        ).catch(function(error){
            console.log(error);
        });
    };
    $scope.post();
});

const app = angular.module("app", ['ngRoute']);

app.controller("exempleCtrl", function($scope, $http) {
    $scope.name = "World";
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'register/register.html',
        controller: 'exempleCtrl'
    });
}]);
