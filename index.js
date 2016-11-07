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



app.listen(8080);
