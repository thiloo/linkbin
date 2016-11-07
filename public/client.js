(function(){
    const linkbinApp = angular.module('linkbinApp', []);

    linkbinApp.controller('frontPageList', ($scope, $http) => {
        $scope.load = () => {
            $http.get('/homepage')
            .then(content => {
                console.log(content);
                $scope.links = content.data.file;
                console.log($scope);
            })
            .catch(error => console.log(error));
        };
        $scope.load();
    });

})();
