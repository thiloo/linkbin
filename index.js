var express = require('express');
var app = express();
var scrape = require('./modules/scraper');
var url = require("url");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bcrypt = require('bcrypt');
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

require('events').EventEmitter.prototype._maxListeners = 100;

// var fill = require('./fillDB')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

var db = require('./db');

app.use(express.static('public'));

app.use(cookieParser());

app.use(cookieSession({
    secret: 'secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.get('/homepage', function(req, res) {
    db.getLinksDetails().then(function(result) {
        res.json({success: true, file: result.rows});
    }).catch(function(err) {
        if (err) {
            console.log(err);
        }
    });
});

app.get('/link/:id', function(req, res) {
    var id = req.params.id;
    var linkDetails = db.getLinkDetails(id);
    var linkComments = db.getLinkComments(id);
    return Promise.all([linkDetails, linkComments]).then(function(results) {
        var result = {};
        result.link = results[0].rows;
        result.comments = results[1].rows;
        res.json({success: true, file: result});
    }).catch(function(err) {
        if (err) {
            console.log(err);
        }
    });
});

app.post('/insertLinkData', function(req, res) {
    if (!req.session.username) {
        console.log('no');
        res.json({success: false});
    } else {
        var linkUrl = req.body.url,
            description = req.body.description,
            username = req.session.username,
            source = url.parse(linkUrl).hostname || '',
            altImg = 'media/default.jpg';
        console.log(linkUrl);
        scrape.scraper(linkUrl).then(function(scraped) {
            console.log(scraped);
            db.insertLinkDetails(linkUrl, scraped.title || linkUrl, description, username, source, scraped.imageUrl || altImg).then(function(result) {
                console.log(result);
                res.json({success: true, file: result});
            }).catch(function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

});

app.post('/insertNormalComment', function(req, res) {
    console.log(req.session.username);
    if (!req.session.username) {
        res.json({success: false});
    } else {
        var linkId = req.body.linkId;
        var comment = req.body.comment;
        var username = req.session.username;
        db.insertComment(linkId, comment, username).then(function(result) {
            db.addCommentToLink(linkId);
            res.json({success: true, file: result.rows[0]});
        }).catch(function(err) {
            if (err) {
                console.log(err);
            }
        });

    }
});

app.post('/insertReplyComment', function(req, res) {
    if (!req.session.username) {
        res.json({success: false});
    } else {

        var linkId = req.body.linkId;
        var comment = req.body.comment;
        var username = req.session.username;
        var parentId = req.body.parentId;
        db.insertReply(linkId, comment, username, parentId).then(function(result) {
            db.addReplyToParent(parentId);
            db.addCommentToLink(linkId);
            res.json({success: true, file: result.rows});
        }).catch(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
});

app.get('/getReplies/:parentId', function(req, res) {
    var parentId = req.params.parentId;
    db.getReplies(parentId).then(function(result) {
        res.json({success: true, file: result.rows});
    });

});

app.post('/addVote/:id', function(req, res) {
    var id = req.params.id;
    var username = req.session.username;
    db.addVote(id).then(function() {
        db.addUserVotes(username, id).then(function(result) {
            res.json({success: true, file: result.rows});
        });
    });
});

app.post('/removeVote/:id', function(req, res) {
    var id = req.params.id;
    var username = req.session.username;
    db.removeVote(id).then(function() {
        db.removeVoteFromUser(username, id).then(function(result) {
            res.json({success: true, file: result.rows});
        });
    });
});

app.get('/userVoted', function(req, res) {
    if (req.session.username) {
        var username = req.session.username;
        db.getUserVotes(username).then(function(result) {
            res.json({success: true, file: result.rows});
        });
    }
});

app.get('/user/:username', function(req, res) {
    var username = req.params.username;
    console.log(req.params);
    console.log(username);
    db.getUserLinks(username).then(function(result) {
        res.json({success: true, file: result.rows});
    }).catch(function(err) {
        if (err) {
            console.log(err);
        }
    });
});

app.post('/user/register', function(req, res) {
    var user = req.body;
    var hash = db.hashPassword(user.password);
    db.createUser(user.user_name, hash, csrfProtection).then(function(result) {
        console.log(result);
        req.session.username = result.rows[0].username;
        console.log(req.session.username);
        res.json({success: true, file: result.rows});
    });
});

app.post('/api/login', function(req, res) {
    var login = req.body;
    console.log('login');
    console.log(login);

    db.getUser(login.user_name).then(function(result) {
        if (result.rows[0].length === 0) {
            console.log('no such user');
        } else {
            console.log(login.password);
            console.log(result);
            db.checkPassword(login.password, result.rows[0].password).then(function(doesMatch) {
                if (doesMatch) {
                    req.session.username = login.user_name;
                    res.json({sucesss: true, file: result.rows});
                } else {
                    console.log('wrong password, try again');
                }
            });
        }
    });
});

app.get('/checkLog', function(req, res) {
    if (req.session.username) {
        res.json({success: true});
    } else {
        res.json({success: false});
    }
});

app.get('/logout', function(req, res) {
    req.session = null;
    res.json({success: true});
});

app.listen(process.env.PORT || 8080);
