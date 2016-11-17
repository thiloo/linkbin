const linkbinApp = angular.module('linkbinApp', ['ngRoute', 'angularMoment', 'ui.bootstrap']);

linkbinApp.run(function($rootScope,$http) {
    $http.get('/checkLog').then(function(result) {
        if (result.data.success===true) {
            $rootScope.username=result.data.file;
            $rootScope.log = true;
            $http.get('/userVoted').then(function(result){
                $rootScope.userVotes = result.data.file[0].voted_links || [];
            });
        }
        else {
            $rootScope.log = false;
            $rootScope.username = null;
        }
    });
});

linkbinApp.controller('header',[ '$scope', '$uibModal', '$http', '$window', '$rootScope', function($scope, $uibModal,$http,$window,$rootScope){
    $scope.login = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'pages/login.html',
            controller: 'register'
        });
    };
    $scope.addLink = function() {
        if($rootScope.log===false) {
            $scope.login();
        }
        else {
            var uibModalInstance = $uibModal.open({
                templateUrl: 'pages/upload.html',
                controller: 'addLink'
            });
        }
    };
    $scope.logout = function() {
        $http.get('/logout').then(function(result) {
            $window.location.href = '/';
        });
    };
    $scope.navbarCollapsed = true;

}]);

linkbinApp.controller('frontPageListView', function($scope, $http, $rootScope) {
    $scope.load = function() {
        $http.get('/homepage').then(function(content) {
            var links = content.data.file;
            if($rootScope.log === true) {
                var votes = $rootScope.userVotes;
                links.forEach(function(link) {
                    link.voted = votes.some(function(vote) {
                        return vote === link.id;
                    });
                });
            }
            $scope.links = links;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
    $scope.addVote = function($event) {
        var id = $event.path[3].id.split('-')[1];
        $http.post(`/addVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };
    $scope.removeVote = function($event) {
        var id = $event.path[3].id.split('-')[1];
        $http.post(`/removeVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };
});

linkbinApp.controller('userView', function($scope, $http, $location, $rootScope) {
    $scope.load = function() {
        var url = $location.path();
        var username = url.split('/')[2];
        $http.get(`/user/${username}`).then(function(content) {
            var links = content.data.file;
            if($rootScope.log === true) {
                var votes = $rootScope.userVotes;
                links.forEach(function(link) {
                    link.voted = votes.some(function(vote) {
                        return vote === link.id;
                    });
                });
            }
            $scope.links = links;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
    $scope.addVote = function($event) {
        var id = $event.path[3].id.split('-')[1];
        $http.post(`/addVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };
    $scope.removeVote = function($event) {
        var id = $event.path[3].id.split('-')[1];
        $http.post(`/removeVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };
});


linkbinApp.controller('favorites', function($scope, $http, $location, $rootScope) {
    $scope.load = function() {
        $http.get('/favorites').then(function(content) {
            var links = content.data.file;
            console.log(content.data);
            if(content.data.success===false) {
                $scope.noFavorites = true;
            }
            if($rootScope.log === true) {
                var votes = $rootScope.userVotes;
                links.forEach(function(link) {
                    link.voted = votes.some(function(vote) {
                        return vote === link.id;
                    });
                });
            }
            $scope.links = links;
        }).catch(function(error) {
            console.log(error);
        });
    };
    $scope.load();
    $scope.addVote = function($event) {
        var id = $event.path[2].id.split('-')[1];
        $http.post(`/addVote/${id}`).then(function(result) {
            localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
        });
    };
    $scope.removeVote = function($event) {
        var id = $event.path[2].id.split('-')[1];
        $http.post(`/removeVote/${id}`).then(function(result) {
            localStorage.setItem('userVotes', JSON.stringify([result.data.file[0]]));
        });
    };
});

linkbinApp.controller('singleLinkView', function($scope, $http, $routeParams, $uibModal, $rootScope) {
    $scope.load = function() {
        $http.get(`/link/${$routeParams.id}`).then(function(content) {
            var link = content.data.file.link[0];
            if($rootScope.log === true) {
                var votes = $rootScope.userVotes;
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
        $http.post(`/addVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };
    $scope.removeVote = function($event) {
        var id = $event.path[2].id.split('-')[1];
        $http.post(`/removeVote/${id}`).then(function(result) {
            $rootScope.userVotes = result.data.file[0].voted_links;
        });
    };

    $scope.getReplies = function($event) {
        // console.log($event.target)
        var parentId = parseInt($event.path[2].id.split('-')[1]);
        // var parentId = $event.target.closest("div .commentContainer").id.split('-')[1];

        console.log(parentId);
        for (var i = 0; i < $scope.comments.length; i++) {
            console.log('hey');
            if ($scope.comments[i].id === parentId) {
                var place = i;
                console.log('place');
                if($scope.comments[i].replies) {
                    $scope.comments[i].replies = "";
                    $scope.comments[i].closeReplies = false;
                    break;
                }
                else {
                    $http.get(`/getReplies/${parentId}`).then(function(content) {
                        $scope.comments[place].replies = content.data.file;
                        $scope.comments[place].closeReplies = true;
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        }
    };

    $scope.reply = function($event) {
        if($rootScope.log===false) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/login.html',
                controller: 'register'
            });
        }
    };

    $scope.submitReply = function($event,data) {
        if($rootScope.log===false) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/login.html',
                controller: 'register'
            });
        }
        var text = $event.target.parentNode.querySelector('textarea');
        var comment = text.value;
        if(!comment) {
            $scope.noText = true;
        }
        else {
            $scope.noText = false;
            var parentId = parseInt($event.path[2].id.split('-')[1]);
            var linkId = $routeParams.id;
            var obj = {
                'comment': comment,
                'linkId': linkId,
                'parentId':parentId
            };
            text.value = '';
            $http.post('/insertReplyComment', obj).then(function(content) {
                for (var i = 0; i < $scope.comments.length; i++) {
                    if ($scope.comments[i].id === parentId) {
                        $scope.comments[i].num_of_replies +=1;
                        if($scope.comments[i].replies) {
                            $scope.comments[i].replies.unshift(content.data.file[0]);
                            break;
                        }
                    }
                }
            });
        }
    };
    $scope.submitComment = function() {
        if($rootScope.log===false) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/login.html',
                controller: 'register'
            });
        }
        var comment = $scope.comment;
        if(!comment && $rootScope.log===true) {
            $scope.noText = true;
        }
        else {
            $scope.noText = false;
            var linkId = $routeParams.id;
            var obj = {
                'comment': comment,
                'linkId': linkId
            };
            $http.post('/insertNormalComment', obj).then(function(content) {
                $scope.comments.unshift(content.data.file);
                $scope.comment = '';
            });
        }
    };
});

linkbinApp.controller('register', function($scope, $http, $rootScope, $uibModalInstance) {
    $scope.user = {username: '', password: ''};
    $scope.message = '';
    $scope.login = function(){
        var config = {
            method: 'POST',
            data: {
                user_name: $scope.user.username,
                password: $scope.user.password
            },
            url:'/api/login'
        };
        $http(config).then(function(response){
            if (response.data.success===false) {
                $scope.invalidLogin = true;
            }
            else {
                $rootScope.log = true;
                $rootScope.username = response.data.file[0].username;
                $rootScope.userVotes = response.data.file[0].voted_links;
                window.location.reload();
                // $uibModalInstance.close('close');
            }
        });
    };

    $scope.register = function(){
        var config = {
            method: 'POST',
            data: {
                user_name:  $scope.user.username,
                password:  $scope.user.password
            },
            url:'/user/register'
        };
        $http(config).then(function(response){
            if(response.data.success===false) {
                $scope.errorInRegister = true;
            }
            else {
                $rootScope.log = true;
                $rootScope.username = response.data.file[0].username;
                console.log(response);
                window.location.reload();
                // $uibModalInstance.close('close');
            }
        });
    };
});

linkbinApp.controller('userComments', function($scope, $http, $routeParams, $location, $rootScope) {

    var url = $location.path();
    var username = url.split('/')[2];

    $http.get(`/comments/${username}`).then(function(content) {

        $scope.userComments = content.data.file;
        // var link = content.data.file.link[0];
        // if($rootScope.log === true) {
        //     var votes = $rootScope.userVotes;
        //     link.voted = votes.some(function(vote) {
        //         return vote === link.id;
        //     });

    });


});


linkbinApp.controller('addLink',['$scope', '$http', '$uibModalInstance','$uibModal', '$location', function($scope, $http, $uibModalInstance, $uibModal, $location) {
    $scope.add = function() {
        var config = {
            method: 'POST',
            data: {
                url:  $scope.link.url,
                description:  $scope.link.description
            },
            url:'/insertLinkData'
        };
        $http(config).then(function(response){
            if(!response.data.success) {
                if(response.data.duplicate) {
                    $scope.error = true;
                    $scope.errorMessage = response.data.error;
                    return;
                } else {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'pages/login.html',
                        controller: 'register'
                    });
                }
            } else {
                $uibModalInstance.close('close');
                $location.path(`/link/${response.data.file.rows[0].id}`);
            }
        });
    };
}]);
