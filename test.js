import Yggtorrent from './index.js';
import config from './config.js';

let ygg = new Yggtorrent(config);

let assert = require('assert');
describe('login', () => {
    it('should log in and get ratio', (cb) => {
        ygg.login((err) => {
            assert.ifError(err);

            ygg.getRatio((err, data) => {
                if (err) console.log(err);
                assert.ifError(err);
                cb();
            });
        });
    });

    it('should find torrents', (cb) => {
        ygg.search('Chernobyl S01', (err, data) => {
            assert.ifError(err);
            cb();
        });
    });
});
