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
    // $scope.isVisible = false;
    $scope.load = function() {
        $http.get(`/${$routeParams.id}`).then(function(content) {
            $scope.link = content.data.file.link[0];
            $scope.comments = content.data.file.comments;
            // console.log($scope.comments);
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
    $scope.getReplies = function($event) {
        var parentId = parseInt($event.path[2].id.split('-')[1]);
        $http.get(`/getReplies/${parentId}`)
        .then(function(content) {
            console.log(typeof parentId);
            console.log($scope.comments);
            for (var i=0;i<$scope.comments.length;i++) {
                if ($scope.comments[i].id === parentId) {
                    $scope.comments[i].replies = content.data.file;
                    console.log($scope.comments[i]);
                    break;
                }
            }
            $scope.closeReplies = true;
        })
        .catch(function(error){
            console.log(error);
        });
    };
    $scope.submitComment = function() {
        var comment = $scope.comment;
        var username = 'tempUsername';
        var linkId = $routeParams.id;
        var obj = {
            'comment':comment,
            'linkId':linkId,
            'username':username
        };
        $http.post('/insertNormalComment',obj).then(function(content) {
             $scope.comments.unshift(content.data.file);
             $scope.comment = '';
        });
    };





});
