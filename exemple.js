import Yggtorrent from './index.js';
import config from './config.js';

/*
config = {
    ost: 'https://yggtorrent.si',
    searchhost: 'https://www2.yggtorrent.si',
    username: 'xxx',
    password: 'xxx',
}
*/

let ygg = new Yggtorrent(config);

ygg.login((err) => {
    if (err) throw new Error(`error while login ${err.message}`);

    ygg.getRatio((err, data) => {
        if (err) throw new Error(`error getting ratio ${err.message}`);

        console.log('data', data);
    });
});

ygg.search('Chernobyl S01', (err, data) => {
    if (err) throw new Error(`error searching ${err.message}`);

    console.log('data', data);
});
