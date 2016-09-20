const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const http = require('http');

const js2xmlparser = require("js2xmlparser");

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

        promises.push(promise0);
        promises.push(promise1);
        promises.push(promise2);

        Promise.all(promises).then(function(values) {
            self.localStoragePublisherUtils.writeLocalSyncSpec(self.publishFilesInSyncSpec);

            var promise = self.writeListOfFilesForLWS();
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

// upload filesToPublish.xml
//         NameValueCollection nvc = new NameValueCollection();
//         filesToCopyXML = HTTPPost.HttpUploadFile(_publishLWSURL + "PrepareForTransfer", filesToPublishPath, "filesToPublish.xml", nvc, lbs.UserName, lbs.Password, this);

                const hostname = "10.1.0.155";
                const endpoint = "/PrepareForTransfer";
                // duplicate code
                const filesToPublishPath = path.join(self.tmpDir, "filesToPublish.xml");

                self.httpUploadFile(hostname, endpoint, filesToPublishPath, "filesToPublish.xml");
            });
        });
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

        var req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

// write data to request body
        req.write(data);
        req.end();

        // We setup our request
        // XHR.open('POST', 'http://ucommbieber.unl.edu/CORS/cors.php');
        //
        // // We add the required HTTP header to handle a multipart form data POST request
        // XHR.setRequestHeader('Content-Type','multipart/form-data; boundary=' + boundary);
        // XHR.setRequestHeader('Content-Length', data.length);
        //
        // // And finally, We send our data.
        // // Due to Firefox's bug 416178, it's required to use sendAsBinary() instead of send()
        // XHR.sendAsBinary(data);

    }

    // private void WriteListOfFilesForLWS(string xmlFileName, List<FileSpec> filesToTransferViaLWS)
    writeListOfFilesForLWS() {

        return new Promise( (resolve, reject) => {

            let listOfFiles = {};
            listOfFiles.files = [];

            console.log("filesToTransferViaLWS", this.filesToTransferViaLWS.length.toString());

            this.filesToTransferViaLWS.forEach( fileToPublish => {

                const fileName = "sha1-" + fileToPublish.hashValue;

                let file = {};
                file.fullFileName = fileName;
                file.fileName = fileToPublish.fileName;
                file.filePath = fileToPublish.fileToPublish.filePath;
                file.hashValue = fileToPublish.hashValue;
                file.fileSize = fileToPublish.fileSize.toString();

                listOfFiles.files.push(file);
            });

            console.log("number of files:", listOfFiles.files.length);

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

