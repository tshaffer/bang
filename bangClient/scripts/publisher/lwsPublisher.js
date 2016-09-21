const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const http = require('http');

const js2xmlparser = require("js2xmlparser");
const xml2js = require('xml2js');

import FileSpec from '../entities/fileSpec';
import FileToPublish from '../entities/fileToPublish';
import BrightSignDownloadItem from '../entities/brightSignDownloadItem';

import LocalStoragePublisherUtils from '../publisher/localStoragePublisherUtils';

// List<FileSpec> filesToTransferViaLWS;
// protected Dictionary<string, Dictionary<string, BrightSignDownloadItem>> PublishFilesInSyncSpec { get; set; }

export default class LWSPublisher {

    constructor() {

        this.localStoragePublisherUtils = new LocalStoragePublisherUtils();

        this.filesToTransferViaLWS = [];
        this.publishFilesInSyncSpec = {};

        this.mediaDir = "/Users/tedshaffer/Documents/bang/media";
        this.tmpDir = "/Users/tedshaffer/Documents/bang/tmp";

    }

    publishToLWS() {

        let self = this;

        let filePath = "";

        this.filesToTransferViaLWS = [];
        this.publishFilesInSyncSpec = {};

        let promises = [];

        // media files
        filePath = path.join(this.mediaDir, "Colorado.jpg");
        let promise0 = this.addFileToLWSPublishList("Colorado.jpg", filePath, "");

        filePath = path.join(this.mediaDir, "GlacierNationalPark.jpg");
        let promise1 = this.addFileToLWSPublishList("GlacierNationalPark.jpg", filePath, "");

        filePath = path.join(this.mediaDir, "BryceCanyonUtah.jpg");
        let promise2 = this.addFileToLWSPublishList("BryceCanyonUtah.jpg", filePath, "");

        filePath = path.join(this.mediaDir, "GrandTeton2.jpg");
        let promise3 = this.addFileToLWSPublishList("GrandTeton2.jpg", filePath, "");

        filePath = path.join(this.mediaDir, "GrandTeton3.jpg");
        let promise4 = this.addFileToLWSPublishList("GrandTeton3.jpg", filePath, "");

        promises.push(promise0);
        promises.push(promise1);
        promises.push(promise2);
        promises.push(promise3);
        promises.push(promise4);

        Promise.all(promises).then(function(values) {
            self.localStoragePublisherUtils.writeLocalSyncSpec(self.publishFilesInSyncSpec);

            let promise = self.writeListOfFilesForLWS();
            promise.then(response => {

                // publish to each unit
                // for now, just publish to one fixed unit
                const ipAddress = "10.1.0.155";

                const publishLWSURL = "http://" + ipAddress + ":8080/";

                let queryString = "";
                // check limitStorageSpace
                queryString += "?limitStorageSpace=" + "false";

// Invoke SpecifyCardSizeLimits
                // does the code need to wait for a response?
                const url = "http://".concat(ipAddress, ":8080/SpecifyCardSizeLimits", queryString);
                // set username / password

                http.get(url, (res) => {
                    console.log(`Got response: ${res.statusCode}`);
                    // consume response body
                    res.resume();
                }).on('error', (e) => {
                    console.log(`Got error: ${e.message}`);
                });

// invoke PrepareForTransfer, providing filesToPublish.xml

                const hostname = "10.1.0.155";
                const endpoint = "/PrepareForTransfer";
                // duplicate code
                const filesToPublishPath = path.join(self.tmpDir, "filesToPublish.xml");

                promise = self.httpUploadFile(hostname, endpoint, filesToPublishPath, "filesToPublish.xml");
                promise.then(rawFilesToCopy => {
                    console.log(rawFilesToCopy);
// create list of files to copy to the BrightSign
                    let filesToCopy = self.getFilesToCopy(rawFilesToCopy);
                });
            });
        });
    }

    getFilesToCopy(rawFilesToCopy) {

        let filesToCopy = [];

        rawFilesToCopy.filesToCopy.file.forEach(file => {
            const fileName = file.fileName[0];
            const hashValue = file.hashValue[0];
            const fileSize = file.fileSize[0];

            const fileToPublish = new FileToPublish(file.filePath[0]);

            const fileSpec = new FileSpec(fileName, fileToPublish, hashValue, fileSize);

            filesToCopy.push(fileSpec);
        });

        return filesToCopy;
    }

    httpUploadFile(hostname, endpoint, filePath, fileName) {

        const buffer = fs.readFileSync(filePath);

        // const boundary = "---------------------" + DateTime.Now.Ticks.ToString("x");
        // byte[] boundarybytes = System.Text.Encoding.ASCII.GetBytes("--" + boundary + "\r\n");
        const boundary = "---------------------8d3e1335c7c9543";


        var data     = "";

        data += "--" + boundary + "\r\n";

        data += 'Content-Disposition: form-data; '
            // We define the name of the form data
            + 'name="'         + "file"          + '"; '
            // We provide the real name of the file
            + 'filename="'     + fileName + '"\r\n';

        data += 'Content-Type: application/octet-stream' + '\r\n';

        data += '\r\n';

        data += buffer;
        data += "\r\n--" + boundary + "--\r\n";

        const options = {
            hostname: hostname,
            port: 8080,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Transfer-Encoding': 'chunked',
                'Expect': '100-continue',
                // 'Connection': 'Keep-Alive'
            }
        };

        return new Promise( (resolve, reject) => {

            let str = "";

            let req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    str += chunk;
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                    var parser = new xml2js.Parser();
                    parser.parseString(str, function (err, jsonResponse) {
                        resolve(jsonResponse);
                    });
                });
            });

            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                reject(e);
            });

            req.write(data);
            req.end();
        });

    }

    // private void WriteListOfFilesForLWS(string xmlFileName, List<FileSpec> filesToTransferViaLWS)
    writeListOfFilesForLWS() {

        return new Promise( (resolve, reject) => {

            let listOfFiles = {};
            listOfFiles.file = [];

            console.log("filesToTransferViaLWS", this.filesToTransferViaLWS.length.toString());

            this.filesToTransferViaLWS.forEach( fileToPublish => {

                const fileName = "sha1-" + fileToPublish.hashValue;

                let file = {};
                file.fullFileName = fileName;
                file.fileName = fileToPublish.fileName;
                file.filePath = fileToPublish.fileToPublish.filePath;
                file.hashValue = fileToPublish.hashValue;
                file.fileSize = fileToPublish.fileSize.toString();

                listOfFiles.file.push(file);
            });

            console.log("number of files:", listOfFiles.file.length);

            const listOfFilesXml = js2xmlparser.parse("files", listOfFiles);

            // write to filesToPublish.xml in tmp dir
            const filePath = path.join(this.tmpDir, "filesToPublish.xml");
            fs.writeFile(filePath, listOfFilesXml, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log("filesToPublish.xml successfully written");
                resolve("ok");
            });
        });
    }

// various sha1 packages
// https://www.npmjs.com/package/sha1
// https://www.npmjs.com/package/node-sha1

// https://gist.github.com/thinkphp/5110833
    getSHA1Hash(data) {
        const generator = crypto.createHash('sha1');
        generator.update(data);
        return generator.digest('hex');
    }

// https://nodejs.org/api/crypto.html
// https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
    getSHA1OfFile(filePath) {

        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha1');

            const input = fs.createReadStream(filePath);
            input.on('readable', () => {
                var data = input.read();
                if (data)
                    hash.update(data);
                else {
                    const sha1 = hash.digest('hex');
                    resolve(sha1);
                }
            });
        });
    }

    getFileSizeInBytes(filePath) {
        var stats = fs.statSync(filePath);
        var fileSizeInBytes = stats["size"];
        return fileSizeInBytes;
    }

    addFileToLWSPublishList(fileName, filePath, groupName) {

        // console.log("basename:", path.basename(filePath));
        // console.log("dirname:", path.dirname(filePath));
        // console.log("extname:", path.extname(filePath));
        //
        // const formattedPath =
        //     path.format({
        //         dir: mediaDir,
        //         base: 'Colorado.jpg'
        //     });
        // console.log("formattedPath:", formattedPath);

        return new Promise ((resolve, reject) => {

            const fileSizeInBytes = this.getFileSizeInBytes(filePath);
            console.log("fileSize:", fileSizeInBytes);

            const getSHA1Promise = this.getSHA1OfFile(filePath);
            getSHA1Promise.then(sha1 => {

                const fileToPublish = new FileToPublish(filePath);
                const fileSpec = new FileSpec(fileName, fileToPublish, sha1, fileSizeInBytes);

                this.filesToTransferViaLWS.push(fileSpec);
                this.addToLocalSyncSpecList(fileName, filePath, fileSizeInBytes, sha1, groupName);

                resolve();
            });
        });
    }

    addToLocalSyncSpecList(fileName, filePath, fileSize, sha1, groupName) {

        const brightSignDownloadItem = new BrightSignDownloadItem(fileName, filePath, fileSize, sha1, groupName);

        if (!(filePath in this.publishFilesInSyncSpec)) {
            let filePathSyncSpecEntries = {};
            filePathSyncSpecEntries[fileName] = brightSignDownloadItem;
            this.publishFilesInSyncSpec[filePath] = filePathSyncSpecEntries;
        }
        else {
            let filePathSyncSpecEntries = this.publishFilesInSyncSpec[filePath];
            if (!(fileName in filePathSyncSpecEntries)) {
                filePathSyncSpecEntries[fileName] = brightSignDownloadItem;
            }
        }
    }
}

