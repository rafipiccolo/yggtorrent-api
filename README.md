# Install

    npm install yggtorrent-api

# Description

yggtorrent scrapper

# Exemple

See exemple file for details : 

[exemple file](exemple.js)

# functions

## constructor : specify host, login and password

    var ygg = new Yggtorrent({
        host: 'https://yggtorrent.si',
        searchhost: 'https://www2.yggtorrent.si',
        username: 'xxx',
        password: 'xxx',
    });

## login : do login

    ygg.login((err) => {
        if (err) return console.log('error', err);

        console.log('logged')
    })

## getRatio: get ratio (need login)

    ygg.getRatio((err, data) => {
        if (err) return console.log('error', err);

        console.log(data)
        // { upload: ' 2.42To', download: ' 1.62To', ratio: '1.493' }
    })

## search: search torrents (dont need login)

    ygg.search('chernobyl s01', (err, data) => {
        if (err) return console.log('error', err);

        console.log(data)
    })

    // displays :
    [
        {
            url: 'https: //www2.yggtorrent.pe/torrent/filmvidéo/série-tv/512032-chernobyl+s01+2019+s01+multi+bdrip+dtshdma+1080p+x265+cyril2000',
            name: 'Chernobyl.S01.(2019).S01.MULTI.BDRIP.DTSHDMA.1080p.x265.Cyril2000',
            size: '17.62Go',
            downloadurl: 'https: //www3.yggtorrent.pe/engine/download_torrent?id=512032'
        },
        {
            url: 'https: //www2.yggtorrent.pe/torrent/filmvidéo/série-tv/462722-chernobyl+s01+multi+1080p+amzn+web-dl+h264-none',
            name: 'Chernobyl.S01.MULTi.1080p.AMZN.WEB-DL.H264-NoNE',
            size: '22.13Go',
            downloadurl: 'https: //www3.yggtorrent.pe/engine/download_torrent?id=462722'
        },
        ...
    ]
