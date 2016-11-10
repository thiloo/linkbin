
linkbinApp.controller('RegisterCtrl', function($scope, $http) {
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
            url:'/api/user'
        };
        $http(config).success(function(response){
            console.log('post works');
        });


        ///TODO ajax route on login to see the token 1)csrf-token 2)

    };
});
