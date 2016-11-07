(function(){
    const linkbinApp = angular.module('linkbinApp', []);

    linkbinApp.controller('header', ($scope) => {

    });

    linkbinApp.controller('frontPageListView', ($scope, $http) => {
        $scope.load = () => {
            $http.get('/homepage')
            .then(content => {
                $scope.links = content.data.file;
            })
            .catch(error => console.log(error));
        };
        $scope.load();
    });

    linkbinApp.controller('singleLinkView', ($scope, $http, $location) => {
        $scope.load = () => {
            $http.get(`/${$location.path}`)
            .then(content => {
                $scope.singleView = content.data.file;
            })
            .catch(error => console.log(error));
        };
    });



})();
