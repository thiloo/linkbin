var express = require('express'),
    app = express(),
    scrape = require('./modules/scraper'),
    url = require('url'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    csrf = require('csurf'),
    csrfProtection = csrf({cookie: true}),
    bodyParser = require('body-parser'),
    db = require('./db'),
    duplicate = require('./modules/duplicate_check');

require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(cookieSession({
    secret: 'secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(csrfProtection);
app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return next();
});

app.get('/homepage', csrfProtection, function(req, res) {
    db.getLinksDetails().then(function(result) {
        var links = result.rows;
        var newLinks = links.map(function(link) {
            link.score =  link.num_of_comments + link.votes - (new Date() - link.created_at)/1000/60/60;
            return link;
        }).sort(function(a,b) {
            return b.score - a.score;
        });
        res.json({success: true, file: newLinks});
    }).catch(function(err) {
        console.log(err);
    });
});

app.get('/link/:id', function(req, res) {
    var id = req.params.id,
        linkDetails = db.getLinkDetails(id),
        linkComments = db.getLinkComments(id);

    return Promise.all([linkDetails, linkComments]).then(function(results) {
        var result = {};
        result.link = results[0].rows;
        result.comments = results[1].rows;
        res.json({success: true, file: result});
    }).catch(function(err) {
        console.log(err);
    });
});

app.post('/insertLinkData', function(req, res) {
    if (!req.session.username) {
        res.json({success: false});
    } else {
        var linkUrl = req.body.url,
            description = req.body.description,
            username = req.session.username,
            source = url.parse(linkUrl).hostname || '',
            altImg = 'media/default.jpg';

        duplicate.check(linkUrl).then(function(cleanUrl) {
            scrape.scraper(cleanUrl).then(function(scraped) {
                db.insertLinkDetails(cleanUrl, scraped.title || cleanUrl, description, username, source, scraped.imageUrl || altImg).then(function(result) {
                    res.json({success: true, file: result});
                }).catch(function(err) {
                    console.log(err);
                });
            });
        })
        .catch(function(err) {
            res.json({success: false, duplicate: true, error: err});
        });
    }
});

app.post('/insertNormalComment', function(req, res) {
    if (!req.session.username) {
        res.json({success: false});
    } else {
        var linkId = req.body.linkId,
            comment = req.body.comment,
            username = req.session.username;

        db.insertComment(linkId, comment, username).then(function(result) {
            db.addCommentToLink(linkId);
            res.json({success: true, file: result.rows[0]});
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.post('/insertReplyComment', function(req, res) {
    if (!req.session.username) {
        res.json({success: false});
    } else {
        var linkId = req.body.linkId,
            comment = req.body.comment,
            username = req.session.username,
            parentId = req.body.parentId;

        db.insertReply(linkId, comment, username, parentId).then(function(result) {
            db.addReplyToParent(parentId);
            db.addCommentToLink(linkId);
            res.json({success: true, file: result.rows});
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.get('/getReplies/:parentId', function(req, res) {
    var parentId = req.params.parentId;

    db.getReplies(parentId).then(function(result) {
        console.log(result.rows);
        res.json({success: true, file: result.rows});
    });
});

app.post('/addVote/:id', function(req, res) {
    var id = req.params.id,
        username = req.session.username;

    db.addVote(id).then(function() {
        db.addUserVotes(username, id).then(function(result) {
            res.json({success: true, file: result.rows});
        });
    });
});

app.post('/removeVote/:id', function(req, res) {
    var id = req.params.id,
        username = req.session.username;

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

    db.getUserLinks(username).then(function(result) {
        res.json({success: true, file: result.rows});
    }).catch(function(err) {
        console.log(err);
    });
});

app.get('/favorites', function(req, res) {
    var username = req.session.username;

    db.getFavorites(username).then(function(result) {
        res.json({success: true, file: result.rows});
    }).catch(function(err) {
        if (err) {
            console.log(err);
            res.json({success:false});
        }
    });
});

app.get('/comments/:username', function(req,res) {
    var username = req.params.username;

    db.getAllcommentsOfUser(username).then(function(result) {
        res.json({success: true, file: result.rows});
    });
});

app.post('/user/register', function(req, res) {
    var user = req.body,
        hash = db.hashPassword(user.password);

    db.createUser(user.user_name, hash).then(function(result) {
        req.session.username = result.rows[0].username;
        res.json({success: true, file: result.rows});
    }).catch(function(err) {
        res.json({success:false, error: err});
    });
});

app.post('/api/login', function(req, res) {
    var login = req.body;

    db.getUser(login.user_name).then(function(result) {
        if (result.rows.length === 0) {
            res.json({success:false});
        }
        else {
            db.checkPassword(login.password, result.rows[0].password).then(function(doesMatch) {
                if (doesMatch) {
                    req.session.username = login.user_name;
                    res.json({sucesss: true, file: result.rows});
                } else {
                    res.json({success:false});
                }
            });
        }
    });
});

app.get('/checkLog', function(req, res) {
    if (req.session.username) {
        res.json({
            success: true,
            file: req.session.username
        });
    } else {
        res.json({success: false});
    }
});

app.get('/logout', function(req, res) {
    req.session = null;
    res.json({success: true});
});

app.listen(process.env.PORT || 8080);
