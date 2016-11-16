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

var bcrypt = require('bcrypt');


// exports.checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase, callback) {
//     bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
//         if (err) {
//             return callback(err);
//         }
//         console.log(doesMatch);
//         callback(null, doesMatch);
//     });
// };

exports.hot_score = function() {
    return getFromDb('SELECT * FROM links ORDER BY ranking(comments + votes, created_at::timestamp) DESC LIMIT 30').then(function(result) {

        // SELECT * FROM links
        //   ORDER BY ranking(
        //     comments + votes,
        //     created_at::timestamp
        //   ) DESC LIMIT 30;
        // // var abs = Math.abs(result);
        // // var max = Math.max(abs);
        // // var log = Math.log10(max);
        // if votes
        console.log(result);
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};


exports.top_score = function() {
    return getFromDb('SELECT * FROM links ORDER BY ranking (log(max(abs(votes),1)), created_at::timestamp) DESC LIMIT 30').then(function(result) {
        console.log(result);
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};


exports.checkPassword = function(requestedPassword, listedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(requestedPassword, listedPassword, function(err, doesMatch) {
            if (err) {
                reject(err);
            }
            else {
                console.log(doesMatch);
                resolve(doesMatch);
            }
        });
    });
};


exports.getUser = function(username){
    return getFromDb('SELECT * FROM users WHERE username=$1',[username]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
};


exports.hashPassword = function(plainTextPassword){
    return bcrypt.hashSync(plainTextPassword, 10);
};

exports.createUser = function(username, password){
    return getFromDb('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]).then(function(result){
        return result;
    }).catch(function(err){
        if(err){
            console.log(err);
        }
    });
};


exports.linksDetails = function() {
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

exports.getLinkComments = function(id) {
    return getFromDb('SELECT * FROM comments WHERE image_id=$1 ORDER BY created_at DESC LIMIT 30',[id]).then(function(result) {
        return result;
    }).catch(function(err) {
        if(err) {
            console.log(err);
        }
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
