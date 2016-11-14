
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
        });
    };

});
