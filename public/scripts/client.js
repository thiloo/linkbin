
const linkbinApp = angular.module('linkbinApp', ['ngRoute', 'angularMoment', 'ui.bootstrap']);
//angularMoment displays time passed dynamically, included via CDN in index.html
var $http = angular.injector(["ng"]).get("$http");
var username = 'harry';
$http.get(`/userVoted/${username}`).then(function(result) {
    localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
});

linkbinApp.controller('header', function($scope, $uibModal){
    $scope.login = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'pages/login.html'
        });
    };
    $scope.addLink = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: 'pages/upload.html',
            controller: 'addLink'
        });
    };
});

linkbinApp.controller('frontPageListView', function($scope, $http) {
    $scope.load = function() {
        $http.get('/homepage').then(function(content) {
            var links = content.data.file;
            var votes = getVotes();
            console.log(votes);
            if (votes != null) {
                votes = getVotes()[0].voted_links;
                links.forEach(function(link) {
                    link.voted = votes.some(function(vote) {
                        return vote === link.id;
                    });
                });
            }

            // add to links information about wether the user has voted on the link already

            $scope.links = links;
            console.log($scope.links);
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
    $scope.removeVote = function($event) {
        console.log('clicked');
        var id = $event.path[2].id.split('-')[1];
        var username = 'harry';
        $http.post(`/removeVote/${id}/${username}`).then(function(result) {
            localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
        });
    };
});

linkbinApp.controller('singleLinkView', function($scope, $http, $routeParams) {
    // $scope.isVisible = false;
    $scope.load = function() {
        $http.get(`/link/${$routeParams.id}`).then(function(content) {
            var link = content.data.file.link[0];
            var votes = getVotes();
            if (votes !== null) {
                votes = getVotes()[0].voted_links;
                link.voted = votes.some(function(vote) {
                    return vote === link.id;
                });
            }
            $scope.link = content.data.file.link[0];
            $scope.comments = content.data.file.comments;
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
    $scope.removeVote = function($event) {
        var id = $event.path[2].id.split('-')[1];
        var username = 'harry';
        $http.post(`/removeVote/${id}/${username}`).then(function(result) {
            localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
        });
    };


    $scope.getReplies = function($event) {
        var parentId = parseInt($event.path[2].id.split('-')[1]);
        for (var i = 0; i < $scope.comments.length; i++) {
            if ($scope.comments[i].id === parentId) {
                var place = i;
                if($scope.comments[i].replies) {
                    $scope.comments[i].replies = "";
                    break;
                }
                else {
                    $http.get(`/getReplies/${parentId}`).then(function(content) {
                        $scope.comments[place].replies = content.data.file;
                        console.log($scope.comments[i]);

                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        }
    };

    $scope.submitReply = function($event,data) {
        var text = $event.target.parentNode.querySelector('textarea');
        var comment = text.value;
        var username = 'tempUsername'
        var parentId = parseInt($event.path[2].id.split('-')[1]);
        var linkId = $routeParams.id;
        var obj = {
            'comment': comment,
            'linkId': linkId,
            'username': username,
            'parentId':parentId
        };
        text.value = '';
        $http.post('/insertReplyComment', obj).then(function(content) {
            for (var i = 0; i < $scope.comments.length; i++) {
                if ($scope.comments[i].id === parentId) {
                    if($scope.comments[i].replies) {
                        $scope.comments[i].replies.unshift(content.data.file[0]);
                        $scope.comments[i].num_of_replies +=1;
                        break;
                    }
                    else {
                        console.log('no replies!')
                        $scope.comments[i].replies=content.data.file[0];
                        $scope.comments[i].num_of_replies +=1;
                        console.log($scope.comments[i].replies=content.data.file)
                        break;
                    }
                }
            }
        });
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

linkbinApp.controller('register', function($scope, $http) {
    $scope.user = {username: '', password: ''};
    $scope.message = '';
    $scope.buttonText="register";

    $scope.register = function(){
        $scope.buttonText=" Registering in. . . ";
        console.log($scope.user);

        var config = {
            method: 'POST',
            data: {
                user_name:  $scope.user.username,
                password:  $scope.user.password
            },
            url:'/user/register'
        };
        $http(config).success(function(response){
            console.log(response);
        });


        //TODO ajax route on login to see the token 1)csrf-token 2)

    };
});


linkbinApp.controller('addLink', function($scope, $http, $uibModalInstance) {
    console.log($uibModalInstance);
    $scope.add = function() {
        var config = {
            method: 'POST',
            data: {
                url:  $scope.link.url,
                description:  $scope.link.description,
                username: 'harry'
            },
            url:'/insertLinkData'
        };
        console.log(config);
        $http(config).success(function(response){
            console.log(response);
        });
        $uibModalInstance.close('close');
    };
});
