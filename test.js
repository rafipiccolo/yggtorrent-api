let Yggtorrent = require('./index.js');
let config = require('./config.js');

let ygg = new Yggtorrent(config);

let assert = require('assert');
describe('login', function () {
    it('should log in and get ratio', function (cb) {
        ygg.login((err) => {
            assert.ifError(err);

            ygg.getRatio((err, data) => {
                if (err) console.log(err);
                assert.ifError(err);
                cb();
            });
        });
    });

    it('should find torrents', function (cb) {
        ygg.search('Chernobyl S01', (err, data) => {
            assert.ifError(err);
            cb();
        });
    });
});
