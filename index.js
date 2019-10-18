var request = require('request');
var cheerio = require('cheerio');
var jar = request.jar();
request.defaults({followAllRedirects: true});

class Ygg {
    constructor(host, username, password) {
        this.host = host;
        this.username = username;
        this.password = password;
    }

    login(callback) {
        request({
            method: 'POST',
            url: this.host+'/user/login',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
            },
            formData: {
                'id': this.username,
                'pass': this.password,
                'ci_csrf_token': '',
            },
            jar: jar
        }, (err, resp, body) => {
            if (err) return callback(err);
            if (resp.statusCode/100 >= 4) return callback(new Error('Bad status code : '+resp.statusCode+'. Bad username/password ?'));

            callback(err, body);
        });
    }

    getRatio(callback) {
        request({
            method: 'GET',
            url: this.host + '/user/ajax_usermenu',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
            },
            jar: jar
        }, (err, resp, body) => {
            if (err) return callback(err);
            if (resp.statusCode / 100 >= 4) return callback(new Error('Bad status code : ' + resp.statusCode));

            try {
                body = JSON.parse(body);
            } catch (e) {
                callback(e);
            }
            body = body.html;
            
            // console.log(body);
            var $ = cheerio.load(body);
            var ratio = body.match(/Ratio : ([0-9\.]+)/)
            var results = {
                upload: $('.ico_upload').parent().text(),
                download: $('.ico_download').parent().text(),
                ratio: ratio[1],
            };

            callback(err, results);
        });
    }

    search(name, callback) {
        request({
            method: 'GET',
            url: this.host + '/engine/search?name='+name+'&do=search',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
            },
            jar: jar
        }, (err, resp, body) => {
            if (err) return callback(err);
            if (resp.statusCode / 100 >= 4) return callback(new Error('Bad status code : ' + resp.statusCode));

            var $ = cheerio.load(body);

            var results = [];
            $('.table-responsive.results tbody tr').each((i, tr) => {
                results.push({
                    // line: $(tr).text(),
                    url: $(tr).find('#torrent_name').attr('href'),
                    name: $(tr).find('#torrent_name').text(),
                    size: $($(tr).find('td')[5]).text(),
                    downloadurl: this.host + '/engine/download_torrent?id=' + $(tr).find('#get_nfo').attr('target'),
                });
            })

            callback(err, results);
        });
    }
}

module.exports = Ygg;
