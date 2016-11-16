
linkbinApp.controller('RegisterCtrl', function($scope, $http) {
    $scope.user = {username: '', password: ''};
    $scope.message = '';
    // $scope.buttonText="register";
    $scope.register = function(){

        console.log($scope.user);
        var config = {
            method: 'POST',
            data: {
                user_name:  $scope.user.username,
                password:  $scope.user.password
            },
            url:'/api/user'
        };
        $http(config).success(function(response){
            console.log('post works');
        });

        ///TODO ajax route on login to see the token 1)csrf-token 2)
    };

    $scope.login = function(){
        console.log($scope.user);
        var config = {
            method: 'POST',
            data: {
                user_name: $scope.user.username,
                password: $scope.user.password
            },
            url:'/api/login'
        };
        $http(config).success(function(response){
            console.log('login works');
            console.log(value);
        });
    };

    $scope.FBlogin = function (){
        
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });

    };




});
