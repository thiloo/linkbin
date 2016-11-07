var express = require('express');
var app = express();

var url = require("url");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
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
})


app.listen(8080);
