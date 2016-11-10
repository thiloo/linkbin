var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bcrypt = require('bcrypt');


///////////////////////////////////////////////////
app.use(cookieParser());

app.use(cookieSession({
    secret: 'secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

// app.use(express.cookieSession());

// var csrfValue = function(req) {
//     var token = (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
//     return token;
// };
// app.use(express.csrf(csrfValue));
//
// app.use(function(req, res, next) {
//     res.cookie('XSRF-TOKEN', req.session._csrf);
//     next();
// });
/////////////////////////////////////////////////////


// csrf
var csrf = require('csurf');
var csrfProtection = csrf();

var url = require("url");

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var db=require('./db');

app.use(express.static('public'));


app.get('/homepage', function(req, res) {

    db.linksDetails().then(function(result) {
        res.json({
            success:true,
            file: result.rows
        });
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
});

app.get('/:id', function(req, res) {
    var id = req.url;
    var linkDetails = db.getLinkDetails(id);
    var linkComments = db.getLinkComments(id);
    return Promise.all([linkDetails, linkComments]).then(function(results) {
        var result = {};
        result.link = results[0].rows;
        result.comments = results[1].rows;
        res.json({
            success:true,
            file:result
        });
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
});

app.post('/api/user', function(req, res){
    var user = req.body;
    console.log(user);

    var hash = db.hashPassword(user.password);

    console.log("this is the password hasshed");

    db.createUser(user.user_name, hash, csrfProtection).then(function(result){
        console.log(result);
        res.json({
            success: true,
            file: result.rows
        });
    });
});

// app.post('/authenticate', function(req,res){
//
//     if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')){
//         res.send(401, 'Wrong user or passwword');
//         return;
//     }
//
//     var profile = {
//         first_name:'John',
//         last_name:'Doe',
//         email:'john@doe.com',
//         id:123
//     };
//
//     var token = jwt.sign(profile, secret, {expiresInMinutes: 60*5});
//
//     res.json= ({token: token});
//
// }
// );

// app.get('/api/restricted', function (req, res) {
//     console.log('user ' + req.user.email + ' is calling /api/restricted');
//     res.json({
//         name: 'foo'
//     });
// });

app.listen(8080);
console.log('Running on port 8080...');
