const request = require('request');
const xml2js = require('xml2js');

/**
 * Created by tedshaffer on 6/10/16.
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getKey(obj, keyIndex) {
    return Object.keys(obj)[keyIndex];
}

export function getFirstKey(obj) {
    return getKey(obj, 0);
}

export function getLastKey(obj) {
    const numKeys = Object.keys(obj).length;
    return getKey(obj, numKeys-1);
}

export function getShortenedFilePath(filePath, maxLength) {

    if (!filePath) return "";

    let shortenedFilePath = filePath;

    if (shortenedFilePath.length > maxLength) {

        let split = shortenedFilePath.split('/');

        if (split && split.length > 2) {
            let currentLength = split[0].length + split[split.length - 1].length + 5;
            shortenedFilePath = '/' + split[split.length - 1];
            let index = split.length - 2;
            while ((currentLength < maxLength) & (index > 0)) {
                currentLength += 1 + split[index].length;
                if (currentLength < maxLength) {
                    shortenedFilePath = "/" + split[index] + shortenedFilePath;
                }
                index--;
            }
            shortenedFilePath = split[0] + "//..." + shortenedFilePath;
        }
    }
    return shortenedFilePath;
}

export function getXMLFile(endPoint) {

    return new Promise((resolve, reject) => {

        var parser = new xml2js.Parser();

        var propertiesObject = {};

        var options = {
            url: endPoint,
            qs: propertiesObject,
        };

        function callback(error, bsResponse, data) {
            if (!error && bsResponse.statusCode == 200) {

                parser.parseString(data, function (err, result) {
                    resolve(result);
                });
            }
            if (error) {
                reject(error);
            }
            else if (bsResponse.statusCode != 200) {
                reject(bsResponse.statusCode);
            }
        }

        request(options, callback);
    });
}

