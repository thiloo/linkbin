(function(){
    const linkbinApp = angular.module('linkbinApp', []);

    linkbinApp.controller('frontPageList', ($scope, $http) => {
        $scope.load = () => {
            $http.get('/homepage')
            .then(content => {
<<<<<<< HEAD
                $scope.links = content.data.file;
            });
=======
                console.log(content);
                $scope.links = content.data.file;
                console.log($scope);
            })
            .catch(error => console.log(error));
>>>>>>> 0a744d2e1b39c415905e968ebfe287ee070015f9
        };
        $scope.load();
    });

})();
