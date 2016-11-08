const linkbinApp = angular.module('linkbinApp', ['ngRoute', 'angularMoment']);
//angularMoment displays time passed dynamically, included via CDN in index.html

linkbinApp.controller('frontPageListView', function($scope, $http) {
    $scope.load = function() {
        console.log('loading');
        $http.get('/homepage').then(function(content) {
            $scope.links = content.data.file;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
});

linkbinApp.controller('singleLinkView', function($scope, $http, $routeParams) {
    $scope.load = function() {
        $http.get(`/${$routeParams.id}`).then(function(content) {
            $scope.link = content.data.file.link[0];
            $scope.comments = content.data.file.comments;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
});
