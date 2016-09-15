var https = require('https');

function serialize(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + encodeURIComponent(obj[key])
    }).join('&');
}

export function getBSNAuthToken(zonePlaylistId, mediaState) {

    return function (dispatch, getState) {

        var postData = {};

        postData.username = "ted/ted@brightsign.biz";
        postData.scope = "full";
        postData.client_secret = "no";
        postData.grant_type = "password";

        postData.password = "admin";
        postData.client_id = 'BSN';

        var postDataStr = serialize(postData);

        var options = {
            hostname: 'ast.brightsignnetwork.com',
            port: 443,
            path: '/2017/01/REST/Token',
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
            }
        };

        var str = "";

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                console.log(str);
                // var data = JSON.parse(str);
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        // write data to request body
        req.write(postDataStr);
        req.end();

    };
}