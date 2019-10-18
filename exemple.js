var Yggtorrent = require('./index.js');
var config = require('./config.js');

/*
config = {
    host: 'https://www3.yggtorrent.pe',
    searchhost: 'https://www2.yggtorrent.pe',
    username: 'xxx',
    password: 'xxx',
}
*/

var ygg = new Yggtorrent(config);

ygg.login(err => {
    if (err) throw new Error('error while login ' + err.message);

    ygg.getRatio((err, data) => {
        if (err) throw new Error('error getting ratio ' + err.message);
        
        console.log('data', data);
    });
});

ygg.search('Chernobyl S01', (err, data) => {
    if (err) throw new Error('error searching ' + err.message);

    console.log('data', data);
});