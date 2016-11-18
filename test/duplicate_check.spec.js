var duplicate = require('../modules/duplicate_check');
var expect = require('chai').expect;

describe('clean the url', function() {
    it('should remove the query string', function(done) {
        duplicate.clean("http://www.blabalab.com/caomges?gmasogon", function(err, result) {
            expect(err).to.be.null;
            expect(result).to.equal("http://www.blabalab.com/caomges");
            done();
        });
    });
    it('should not do anything to the url', function(done) {
        duplicate.clean("http://thilo.io", function(err, result) {
            expect(err).to.be.null;
            expect(result).to.equal("http://thilo.io/");
            done();
        });
    });
    it('should return not an url error', function(done) {
        duplicate.clean("hello world", function(err, result) {
            console.log(err);
            expect(err).to.not.be.null;
            expect(result).to.equal(undefined);
            done();
        });
    });
});
