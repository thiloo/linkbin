var db = require('./db'),
    faker = require('faker');

function fill() {
    for(var i = 0; i < 5; i++) {
        var comment = `${faker.random.words()} ${faker.random.words()} ${faker.random.words()}`
        db.insertComment(1, comment, faker.internet.userName());
    }
}

function addReplies() {
    for(var i = 0; i < 15; i++) {
        var comment = `${faker.random.words()} ${faker.random.words()} ${faker.random.words()}`
        db.insertReply(1, comment, faker.internet.userName(), 1);
        db.addReplyToParent(1);
    }
}



fill();
addReplies();
