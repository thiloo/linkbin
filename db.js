var pg = require('pg');
var password = require('./password.json');
var dbUrl = `postgres://${password.user}:${password.password}@localhost:5432/linkbin`;

dbUrl = require('url').parse(dbUrl);


var dbUser = dbUrl.auth.split(':');

var dbConfig = {
    user: dbUser[0],
    database: dbUrl.pathname.slice(1),
    password: dbUser[1],
    host: dbUrl.hostname,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(dbConfig);

pool.on('error', function(err) {
    if(err) {
        console.log(err);
    }
});


exports.getLinksDetails = function() {
    return getFromDb('SELECT * FROM links ORDER BY created_at DESC LIMIT 60').then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.getLinkDetails = function(id) {
    return getFromDb('SELECT * FROM links WHERE id=$1', [id]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.insertLinkDetails = function(link,headlineInLink,givenTitle,username,source,picture) {
    return getFromDb('INSERT into links(link, headline_in_link, given_title, username, source, picture) VALUES($1,$2,$3,$4,$5,$6) RETURNING id', [link,headlineInLink,givenTitle,username,source,picture]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.getLinkComments = function(id) {
    return getFromDb('SELECT * FROM comments WHERE link_id=$1 and parent_id=0 ORDER BY created_at DESC LIMIT 200',[id]).then(function(result) {
        console.log(result);
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.insertComment = function(linkId, comment, username) {
    return getFromDb('INSERT into comments(link_id,comment,username) VALUES($1,$2,$3) RETURNING id,comment,username,created_at,num_of_replies', [linkId,comment,username]).then(function(result) {
        console.log('result in db');
        console.log(result);
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};


exports.insertReply = function(linkId, comment, username, parentId) {
    return getFromDb('INSERT into comments(link_id,comment,username,parent_id) VALUES($1,$2,$3,$4) RETURNING parent_id', [linkId,comment,username,parentId]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};


exports.addReplyToParent = function(parentId) {
    return getFromDb('UPDATE comments SET num_of_replies = num_of_replies + 1 WHERE id=$1 RETURNING id', [parentId]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.getReplies = function(parentId) {
    return getFromDb('SELECT * FROM comments WHERE parent_id=$1  ORDER BY created_at DESC LIMIT 200',[parentId]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.addVote = function(id) {
    return getFromDb('UPDATE links SET votes = votes + 1 WHERE id=$1 RETURNING id', [id]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.addVoteToUser = function(username, id) {
    return getFromDb('UPDATE users SET voted_links = voted_links.push(id) WHERE username=$1 RETURNING voted_links', [username]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};

exports.getUserVotes = function(username) {
    return getFromDb('SELECT voted_links FROM users WHERE username = $1', [username]).then(function(result) {
        return result;
    }).catch(function(error) {
        console.log(error);
    });
};

exports.addUserVotes = function(username, link_id) {
    return getFromDb('UPDATE users SET voted_links = array_append(voted_links, $2) WHERE username = $1 RETURNING voted_links', [username, link_id]).then(function(result){
        console.log(result);
    })
    .catch(function(error){
        console.log(error);
    });
};

function getFromDb(str, params) {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err, client, done) {
            if (err) {
                reject(err);
                return;
            }
            client.query(str, params || [], function(err, result) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                done();
            });
        });
    });
}
