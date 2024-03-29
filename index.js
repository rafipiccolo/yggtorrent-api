import request from 'request';
import cheerio from 'cheerio';
let jar = request.jar();
request.defaults({ followAllRedirects: true });

class Ygg {
    constructor(config) {
        this.host = config.host;
        this.searchhost = config.searchhost;
        this.username = config.username;
        this.password = config.password;
    }

    login(callback) {
        request(
            {
                method: 'POST',
                url: `${this.host}/user/login`,
                headers: {
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                },
                formData: {
                    id: this.username,
                    pass: this.password,
                },
                jar,
            },
            (err, response, body) => {
                if (err) return callback(err);
                if (response.statusCode / 100 >= 4) {
                    let error = new Error(`Bad status code while login : ${response.statusCode}. Bad username/password ?`);
                    error.body = body;
                    return callback(error);
                }

                callback(err, body);
            }
        );
    }

    getRatio(callback) {
        request(
            {
                method: 'GET',
                url: `${this.host}/user/ajax_usermenu`,
                headers: {
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                },
                jar,
                json: true,
            },
            (err, response, body) => {
                if (err) return callback(err);
                if (response.statusCode / 100 >= 4) {
                    let error = new Error(`Bad status code getting ratio : ${response.statusCode}`);
                    error.body = body;
                    return callback(error);
                }

                body = body.html;

                // console.log(body);
                let $ = cheerio.load(body);
                let ratio = body.match(/Ratio : ([0-9\.]+)/);
                let results = {
                    upload: $('.ico_upload').parent().text(),
                    download: $('.ico_download').parent().text(),
                    ratio: ratio[1],
                };

                callback(err, results);
            }
        );
    }

    search(name, callback) {
        request(
            {
                method: 'GET',
                url: `${this.searchhost}/engine/search`,
                qs: {
                    name,
                    do: 'search',
                },
                headers: {
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                },
                jar,
            },
            (err, response, body) => {
                if (err) return callback(err);
                if (response.statusCode / 100 >= 4) {
                    let error = new Error(`Bad status code while searching : ${response.statusCode}`);
                    error.body = body;
                    return callback(error);
                }

                let $ = cheerio.load(body);

                let results = [];
                $('.table-responsive.results tbody tr').each((i, tr) => {
                    results.push({
                        // line: $(tr).text(),
                        url: $(tr).find('#torrent_name').attr('href'),
                        name: $(tr).find('#torrent_name').text().trim(),
                        size: $($(tr).find('td')[5]).text(),
                        downloadurl: `${this.searchhost}/engine/download_torrent?id=${$(tr).find('#get_nfo').attr('target')}`,
                    });
                });

                callback(err, results);
            }
        );
    }
}

export default Ygg;
