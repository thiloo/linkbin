var url = require('url'),
    db = require('../db');

module.exports.check = function(link) {
    return new Promise(function(resolve, reject) {
        var parsed = url.parse(link),
            cleanUrl= `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;
        db.checkForDuplicateUrl(cleanUrl).then(function(result) {
            if(result.rows.length > 0) {
                reject('This link was already shared on linkbin! Please only post new content');
            } else {
                resolve(cleanUrl);
            }
        });
    });
};
