linkbinApp.config(function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
    });
});


// exports.register = function( req,res){
//     res.render('login', { csrfToken: req.csrfToken() });
// };
