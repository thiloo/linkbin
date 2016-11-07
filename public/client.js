(function(){
    const linkbinApp = angular.module('linkbinApp', []);

    linkbinApp.controller('frontPageList', ($scope, $http) => {
        $scope.load = () => {
            $http.get('/homepage')
            .then(content => {
                $scope.links = content.data;
            });
        };
        $scope.load();
    });

})();
