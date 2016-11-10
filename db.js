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


// // Hash the password with a Salt
// function hashPassword(plainTextPassword, callback) {
//     bcrypt.genSalt(function(err, salt) {
//         if (err) {
//             return callback(err);
//         }
//         console.log(salt, plainTextPassword);
//         bcrypt.hash(plainTextPassword, salt, function(err, hash) {
//             if (err) {
//                 return callback(err);
//             }
//             console.log(hash);
//             callback(null, hash);
//             // Store hash in password DB.
//         });
//     });
// }

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
