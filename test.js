var Yggtorrent = require('./index.js');
var config = require('./config.js');

var ygg = new Yggtorrent(config);

var assert = require('assert');
describe('login', function() {
    it('should log in and get ratio', function(cb) {
        ygg.login((err) => {
            assert.ifError(err);

            ygg.getRatio((err, data) => {
                if (err) console.log(err);
                assert.ifError(err);
                cb();
            });
        });
    });

    it('should find torrents', function(cb) {
        ygg.search('Chernobyl S01', (err, data) => {
            assert.ifError(err);
            cb();
        });
    });
});
