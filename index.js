var express = require('express');
var app = express();
var scrape = require('./modules/scraper');
var url = require("url");
require('events').EventEmitter.prototype._maxListeners = 100;

// var fill = require('./fillDB')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

var db=require('./db');

app.use(express.static('public'));




app.get('/homepage', function(req, res) {
    db.getLinksDetails().then(function(result) {
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
    var id = req.params.id;
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


app.post('/insertLinkData', function(req,res) {
    var link = req.body.link,
        description = req.body.description,
        username = req.body.username,
        source = url.parse(link).hostname,
        altImg = 'media/default.jpg';

    scrape.scraper(link).then(function(scraped) {
        console.log(scraped);
        db.insertLinkDetails(link,scraped.title || link, description, username, source, scraped.imageUrl || altImg).then(function(result) {
            console.log(result);
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
});

app.post('/insertNormalComment', function(req, res) {
    var linkId = req.body.linkId;
    var comment = req.body.comment;
    var username = req.body.username;
    db.insertComment(linkId, comment, username).then(function(result) {
        res.json({
            success:true,
            file:result.rows[0]
        });
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
});


app.post('/insertReplyComment', function(req, res) {
    var linkId = req.body.linkId;
    var comment = req.body.comment;
    var username = req.body.username;
    var parentId = req.body.parentId;
    db.insertReply(linkId,comment,username,parentId).then(function(parentId) {
        db.addReplyToParent(parentId);
    }).then(function() {
        res.json({
            success:true
        });
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
});

app.get('/getReplies/:parentId', function (req,res) {
    var parentId = req.params.parentId;
    db.getReplies(parentId).then(function(result) {
        console.log(result);
        res.json({
            success:true,
            file:result.rows
        });

    });
});

app.post('/addVote/:id/:username', function(req, res) {
    var id = req.params.id;
    var username = req.params.username;
    db.addVote(id).then(function() {
        db.addUserVotes(username, id).then(function(result) {
            res.json({
                success:true,
                file: result.rows
            });
        });
    });
});

app.post('/removeVote/:id/:username', function(req, res) {
    var id = req.params.id;
    var username = req.params.username;
    db.removeVote(id).then(function() {
        db.removeVoteFromUser(username, id).then(function(result) {
            res.json({
                success:true,
                file: result.rows
            });
        });
    });
});


app.get('/userVoted/:username', function(req, res) {
    var username = req.params.username;
    db.getUserVotes(username).then(function(result) {
        res.json({
            success: true,
            file: result.rows
        });
    });
});

app.listen(8080);
