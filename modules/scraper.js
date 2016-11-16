var fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request');

module.exports.scraper = function(url) {
    return new Promise(function(resolve, reject){
        request = request.defaults({jar: true,
            headers: {
                'User-Agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36"
            }});
        request(url, function(error, response, html) {
            if(!error) {
                var $ = cheerio.load(html);
                var json = { title: "" , imageUrl: ""};
                $('meta[property="og:title"]').filter(function() {
                    var data = $(this);
                    json.title = data.attr().content;
                });
                $('meta[property="og:image"]').filter(function() {
                    var data = $(this);
                    json.imageUrl = data.attr().content;
                });
                resolve(json);
            } else {
                reject(error);
            }
        });
    });
};
