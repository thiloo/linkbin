var pg = require('pg');
var password = require('password.json');
<<<<<<< HEAD
var dbUrl = 'postgres://spicedling:036363976@localhost:5432/linkbin';
=======
var dbUrl = `postgres://${password.user}:${password.password}@localhost:5432/linkbin`;
>>>>>>> 0a744d2e1b39c415905e968ebfe287ee070015f9

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


exports.linksDetails = function() {
    return getFromDb('SELECT * FROM links ORDER BY created_at DESC LIMIT 60').then(function(result) {
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
