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


app.post('insertLinkData', function(req,res) {
    var link = req.body.link;
    var headlineInLink = req.body.headlineInLink;
    var givenTitle = req.body.givenTitle;
    var username = req.body.username;
    var source = req.body.source;
    var picture = req.body.picture;
    db.insertLinkDetails(link,headlineInLink,givenTitle,username,source,picture).then(function() {
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

app.post('/insertNormalComment', function(req, res) {
    var linkId = req.body.linkId;
    var comment = req.body.comment;
    var username = req.body.username;
    db.insertComment(linkId, comment, username).then(function() {
        res.json({
            success:true
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

app.get('/addVote/:id/:username', function(req, res) {
    var id = req.params.id;
    var username = req.params.username;
    db.addVote(id).then(function() {
        db.addVoteToUser(username, id);

        res.json({
            success:true
        });
    });
});


app.listen(8080);
