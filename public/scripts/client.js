
const linkbinApp = angular.module('linkbinApp', ['ngRoute', 'angularMoment']);
//angularMoment displays time passed dynamically, included via CDN in index.html
var $http = angular.injector(["ng"]).get("$http");
var username = 'harry';
$http.get(`/userVoted/${username}`).then(function(result) {
    localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
});


linkbinApp.controller('frontPageListView', function($scope, $http) {
    $scope.load = function() {
        $http.get('/homepage').then(function(content) {
            var links = content.data.file;
            var votes = getVotes()[0].voted_links;
            // add to links information about wether the user has voted on the link already
            links.forEach(function(link) {
                link.voted = votes.some(function(vote) {
                    return vote === link.id;
                });
            });
            $scope.links = links;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
    $scope.addVote = function($event) {
        var id = $event.path[2].id.split('-')[1];
        var username = 'harry';
        $http.post(`/addVote/${id}/${username}`).then(function(result) {
            localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
        });
    };
});

linkbinApp.controller('userVotes', function($scope, $http) {
    // add to votes array

    // obtain the array of upvoted articles from the database

    // store the array in local storage

    // get the array from local storage

    // update client view to indicate upvoted articles

    // update localstorage upon changes in user vote

});

linkbinApp.controller('singleLinkView', function($scope, $http, $routeParams) {
    // $scope.isVisible = false;
    $scope.load = function() {
        $http.get(`/${$routeParams.id}`).then(function(content) {
            var link = content.data.file.link[0];
            var votes = getVotes()[0].voted_links;
            link.voted = votes.some(function(vote) {
                return vote === link.id;
            });
            $scope.link = content.data.file.link[0];
            $scope.comments = content.data.file.comments;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();


    var bool = false;
    var place;
    $scope.getReplies = function($event) {
        if (bool === true) {
            $scope.comments[place].replies = "";
            bool = false;
        } else {
            var parentId = parseInt($event.path[2].id.split('-')[1]);
            $http.get(`/getReplies/${parentId}`).then(function(content) {
                for (var i = 0; i < $scope.comments.length; i++) {
                    if ($scope.comments[i].id === parentId) {
                        $scope.comments[i].replies = content.data.file;
                        bool = true;
                        place = i;
                        console.log($scope.comments[i]);
                        break;
                    }
                }
            }).catch(function(error) {
                console.log(error);
            });
        }
    };

    $scope.reply = function($event) {
        console.log($event);
        var parentId = parseInt($event.path[1].id.split('-')[1]);
        console.log(parentId);
    }

    $scope.submitReply = function($event) {
        console.log($scope.replyText);
    };

    $scope.submitComment = function() {
        var comment = $scope.comment;
        var username = 'tempUsername';
        var linkId = $routeParams.id;
        var obj = {
            'comment': comment,
            'linkId': linkId,
            'username': username
        };
        $http.post('/insertNormalComment', obj).then(function(content) {
            $scope.comments.unshift(content.data.file);
            $scope.comment = '';
        });
    };

});

linkbinApp.controller('RegisterCtrl', function($scope, $window) {
    $scope.user = {
        username: 'john.doe',
        password: 'foobar'
    };
    $scope.message = '';

    $scope.buttonText = "register";
    $scope.register = function() {
        console.log($scope);
        $scope.buttonText = " Registering in. . . ";
        console.log($scope.buttonText);

        $http.post('/authenticate', $scope.user).success(function(data, status, headers, config) {
            $window.sessionStorage.token = data.token;
            $scope.message = 'Welcome';
        }).error(function(data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;

            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';

            // authService.register($scope.credentials.username, $scope.credentials.password).then(function(data){
            //     // $state.go('user.postViewAll');
            //     console.log(data);
            //     $state.go('home');
            // },function(err){
            //     $scope.invalidRegister=true;
            // }).finally(function(){
            //     $scope.buttonText="Register";
            // });
        });
    };
});
