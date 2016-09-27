const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const http = require('http');

const request = require('request');

const js2xmlparser = require("js2xmlparser2");
const xml2js = require('xml2js');

import FileSpec from '../entities/fileSpec';
import FileToPublish from '../entities/fileToPublish';
import BrightSignDownloadItem from '../entities/brightSignDownloadItem';

import LocalStoragePublisherUtils from '../publisher/localStoragePublisherUtils';

import LocalHTMLSite from '../entities/localHTMLSite';
import HTMLPublishSite from '../entities/htmlPublishSite';
import HtmlFileToPublish from '../entities/htmlFileToPublish';

// protected Dictionary<string, FileToPublish> PublishAllFilesToCopy { get; set; }
// List<FileSpec> filesToTransferViaLWS;
// protected Dictionary<string, Dictionary<string, BrightSignDownloadItem>> PublishFilesInSyncSpec { get; set; }

export default class LWSPublisher {

    constructor() {

        this.localStoragePublisherUtils = new LocalStoragePublisherUtils();

        this.publishAllFilesToCopy = {};            // dictionary that maps fileName to fileToPublish
        this.filesToTransferViaLWS = [];            // List<fileSpec>
        this.publishFilesInSyncSpec = {};           // Dictionary<string, Dictionary<string, BrightSignDownloadItem>>

        this.mediaDir = "/Users/tedshaffer/Documents/bang/media";
        this.tmpDir = "/Users/tedshaffer/Documents/bang/tmp";
        this.appData = "/Users/tedshaffer/Documents/bang/appDataTmp";
        this.baDir = "/Users/tedshaffer/Documents/Projects/BA/BrightAuthor/bin/Debug";
        this.baDirTemplates = "/Users/tedshaffer/Documents/Projects/BA/BrightAuthor/bin/Debug/templates";
    }

    retrievePresentations() {
        // totally phony version for now
        this.addToPublishAllFilesToCopy(path.join(this.mediaDir, "spiralY.ts"), "spiralY.ts");
        this.addToPublishAllFilesToCopy(path.join(this.mediaDir, "0artbeats_red_m1080p.ts"), "0artbeats_red_m1080p.ts");
        this.addToPublishAllFilesToCopy(path.join(this.mediaDir, "0arc.mp4"), "0arc.mp4");
        this.addToPublishAllFilesToCopy(path.join(this.appData, "autoplay-mcBangLWS-1.xml"), "autoplay-mcBangLWS-1.xml");
    }

    publishFirmwareFileForLWS(publishFirmware) {

        var self = this;

        let ok = true;
        let promise = null;

        let filePath = "";
        let fileName = "";

        return new Promise( (resolve, reject) => {
            if (publishFirmware.firmwareUpdateSource == "specific")
            {
                filePath = publishFirmware.firmwareUpdateSourceFilePath;
                fileName = publishFirmware.getFirmwareUpdateTargetFileName(this.publishFirmwareType);
                resolve(self.addFileToLWSPublishList(fileName, filePath, "script"));
            }
            else if ((publishFirmware.firmwareUpdateSource == "production") || (publishFirmware.firmwareUpdateSource == "beta") || (publishFirmware.firmwareUpdateSource == "compatible"))
            {
                let fileUrl = "";

                if (publishFirmware.firmwareUpdateSource == "production")
                {
                    fileUrl = publishFirmware.productionReleaseURL;
                }
                else if (publishFirmware.firmwareUpdateSource == "beta")
                {
                    fileUrl = publishFirmware.betaReleaseURL;
                }
                else
                {
                    fileUrl = publishFirmware.compatibleReleaseURL;
                }

                const tmpFolder = self.tmpDir;
                let targetFWFile = path.join(tmpFolder, publishFirmware.getFirmwareUpdateTargetFileName(self.publishFirmwareType));

                request({uri: fileUrl})
                    .pipe(fs.createWriteStream(targetFWFile))
                    .on('close', function() {
                        console.log("write complete to:", targetFWFile);
                        fileName = publishFirmware.getFirmwareUpdateTargetFileName(self.publishFirmwareType);
                        resolve(self.addFileToLWSPublishList(fileName, targetFWFile, "script"));
                    });
            }
            else {
                resolve(null);
            }
        });
    }

    publishToLWS(firmwareUpdateType, pumaPublishFirmware,
                 panteraPublishFirmware, impalaPublishFirmware,
                 pantherPublishFirmware, cheetahPublishFirmware,
                 tigerPublishFirmware, bobcatPublishFirmware, lynxPublishFirmware) {

        let self = this;

        // initialize data structures used in publish
        this.publishAllFilesToCopy = {};
        this.filesToTransferViaLWS = [];
        this.publishFilesInSyncSpec = {};

        this.publishFirmwareType = firmwareUpdateType;
        this.publishFirmwareDictionary = {};
        this.publishFirmwareDictionary["PumaPublishFirmware"] = pumaPublishFirmware;
        this.publishFirmwareDictionary["PanteraPublishFirmware"] = panteraPublishFirmware;
        this.publishFirmwareDictionary["ImpalaPublishFirmware"] = impalaPublishFirmware;
        this.publishFirmwareDictionary["PantherPublishFirmware"] = pantherPublishFirmware;
        this.publishFirmwareDictionary["CheetahPublishFirmware"] = cheetahPublishFirmware;
        this.publishFirmwareDictionary["TigerPublishFirmware"] = tigerPublishFirmware;
        this.publishFirmwareDictionary["BobcatPublishFirmware"] = bobcatPublishFirmware;
        this.publishFirmwareDictionary["LynxPublishFirmware"] = lynxPublishFirmware;

        this.retrievePresentations();
        let getBasFilesPromise = this.getBASFiles();

        getBasFilesPromise.then(response => {

            let promises = [];

            debugger;
            for (let family in self.publishFirmwareDictionary) {
                const publishFamilyFirmware = self.publishFirmwareDictionary[family];
                if (publishFamilyFirmware) {
                    let fwPromise = self.publishFirmwareFileForLWS(publishFamilyFirmware);
                    if (fwPromise) {
                        promises.push(fwPromise);
                    }
                }
            }

            // media files
            for (let fileName in self.publishAllFilesToCopy) {
                if (self.publishAllFilesToCopy.hasOwnProperty(fileName)) {
                    const fileToPublish = self.publishAllFilesToCopy[fileName];
                    const filePath = fileToPublish.filePath;
                    promises.push(self.addFileToLWSPublishList(fileName, filePath, ""));
                }
            }

            promises.push(this.getSystemFiles());
            promises.push(this.getMiscellaneousFiles());

            Promise.all( promises ).then(values => {

                // generate and write sync spec
                let promise = self.localStoragePublisherUtils.writeLocalSyncSpec(self.publishFilesInSyncSpec, self.tmpDir, "new-local-sync.xml");
                promise.then(response => {
                    promise = self.writeListOfFilesForLWS();
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

// invoke PrepareForTransfer, providing filesToPublish.xml to BrightSign

                        const hostname = "10.1.0.155";
                        let endpoint = "/PrepareForTransfer";
                        // duplicate code
                        const filesToPublishPath = path.join(self.tmpDir, "filesToPublish.xml");

                        promise = self.httpUploadFile(hostname, endpoint, filesToPublishPath, "filesToPublish.xml");
                        promise.then(rawFilesToCopy => {
                            console.log(rawFilesToCopy);
// based on response from BrightSign, create list of files to copy to the BrightSign
                            let filesToCopy = self.getFilesToCopy(rawFilesToCopy);

// ensure that if the family and fwVersions were set, that they are sufficiently new

// upload the files to the BrightSign
                            promises = [];
                            filesToCopy.forEach( fileSpec => {
                                const promise = self.uploadFileToBrightSign(fileSpec.fileToPublish.filePath, fileSpec.fileName, fileSpec.hashValue);
                                promises.push(promise);
                            });
                            Promise.all(promises).then((values) => {
                                console.log("all files uploaded to BrightSign");
                                // HTTPPost.HttpUploadFile(_publishLWSURL + "UploadSyncSpec", filePath, "new-local-sync.xml", nvc, lbs.UserName, lbs.Password, this);

                                // uploadSyncSpec
                                endpoint = "/UploadSyncSpec";
                                let filePath = path.join(self.tmpDir, "new-local-sync.xml");
                                promise = self.httpUploadFile(hostname, endpoint, filePath, "new-local-sync.xml");
                            }, err => {
                                debugger;

                                // hack for now - assume all files exist on BS
                                console.log("error uploading all files to BrightSign, proceed for now");

                                // uploadSyncSpec
                                endpoint = "/UploadSyncSpec";
                                let filePath = path.join(self.tmpDir, "new-local-sync.xml");
                                promise = self.httpUploadFile(hostname, endpoint, filePath, "new-local-sync.xml");

                            });
                        });
                    });
                });
            }, function(err) {
                debugger;
            });

        }, function(err) {
            debugger;
        });
    }

    addToPublishAllFilesToCopy(filePath, fileName) {
        let fileToPublish = new FileToPublish(filePath);
        this.publishAllFilesToCopy[fileName] = fileToPublish;
    }

    getBASFiles() {

        return new Promise( (resolve, reject) => {
            var self = this;
            const basDir = path.join(this.baDir, "www", "BrightSignApplicationServer");
            const basPath = path.join(basDir, "index.html");

            const queryStringParam = "";
            const brightSignApplicationServerSite = new LocalHTMLSite("BrightSignApplicationServer", basPath, queryStringParam);
            const htmlPublishSite = new HTMLPublishSite(brightSignApplicationServerSite.name, brightSignApplicationServerSite.filePath);

            const promise = this.getHTMLContent(htmlPublishSite, false);
            promise.then( response => {
                resolve(self.publishFilesInSyncSpec);
            }, function (err) {
                debugger;
            });
        });
    }

    getMiscellaneousFiles() {
        return new Promise ( (resolve, reject) => {

            let promises = [];

            let miscellaneousFiles = {};
            miscellaneousFiles["deviceWebPage.html"] = path.join(this.baDirTemplates, "deviceWebPage.html");
            miscellaneousFiles["deviceIdWebPage.html"] = path.join(this.baDirTemplates, "deviceIdWebPage.html");
            miscellaneousFiles["featureMinRevs.xml"] = path.join(this.baDirTemplates, "featureMinRevs.xml");
            miscellaneousFiles["BoseProducts.xml"] = path.join(this.baDirTemplates, "BoseProducts.xml");
            // miscellaneousFiles["autoplay-mcBangLWS-0.xml"] = path.join(this.appData, "autoplay-mcBangLWS-0.xml");

            let miscellaneousFile = null;
            for (miscellaneousFile in miscellaneousFiles) {

                let fileName = miscellaneousFile;
                let filePath = miscellaneousFiles[fileName];

                promises.push(this.addFileToLWSPublishList(fileName, filePath, ""));
            }

            Promise.all( promises ).then(values => {
                resolve("ok");
            }, err => {
                debugger;

            });
        });
    }

    getSystemFiles() {

        return new Promise ( (resolve, reject) => {

            let promises = [];

            let systemFiles = {};
            systemFiles["resources.txt"] = path.join(this.appData, "resources.txt");
            systemFiles["autoplugins.brs"] = path.join(this.appData, "autoplugins.brs");
            systemFiles["autoschedule.xml"] = path.join(this.appData, "autoschedule.xml");
            systemFiles["autorun.brs"] = path.join(this.baDirTemplates, "autoxml.brs");

            let systemFile = null;
            for (systemFile in systemFiles) {

                let fileName = systemFile;
                let filePath = systemFiles[fileName];

                let groupName = "";
                if (fileName.endsWith(".brs")) groupName = "script";

                promises.push(this.addFileToLWSPublishList(fileName, filePath, groupName));
            }

            Promise.all( promises ).then(values => {
                resolve("ok");
            }, err => {
                debugger;

            });
        });
    }

    getHTMLContent(htmlSite, checkFileCount) {

        let self = this;

        return new Promise( (resolve, reject) => {

            let numberOfFilesInSite = 0;

            let pseudoFileName = "";

            const filePath = htmlSite.filePath; // this is the main web page - need to keep track of it for BSN uploads
            const siteDirectory = path.dirname(filePath);

            const readDir = require('recursive-readdir');
            readDir(siteDirectory, (err, siteFiles) => {
                // siteFiles is an array of filenames

                siteFiles.forEach( siteFile => {
                    const fileSize = this.getFileSizeInBytes(siteFile);
                    if (fileSize > 0) { // strip zero length files

                        // get relative url
                        let relativeUrl = siteFile;

                        if (siteFile.startsWith(siteDirectory))
                        {
                            relativeUrl = siteFile.substring(siteDirectory.length);
                            while (relativeUrl.startsWith("/"))
                            {
                                relativeUrl = relativeUrl.substring(1);
                            }
                        }

                        // file prefix is "<site name>--". If it changes here, it must also change in HTMLSite
                        pseudoFileName = htmlSite.siteName + "-" + relativeUrl;

                        numberOfFilesInSite++;

                        const htmlFileToPublish = new HtmlFileToPublish(
                            siteFile, "", false, siteFile == filePath, htmlSite.siteName, path.basename(siteFile), relativeUrl
                        );

                        if (!(pseudoFileName in self.publishFilesInSyncSpec)) {
                            // this.publishFilesInSyncSpec[pseudoFileName] = htmlFileToPublish;
                            // self.addToPublishAllFilesToCopy(pseudoFileName, filePath)
                            self.publishAllFilesToCopy[pseudoFileName] = htmlFileToPublish;
                        }
                    }
                });

                // if the number of files in the site exceeds 200, put up a warning as the user may have included files in the site unintentionally
                resolve(self.publishFilesInSyncSpec);
            });
        });
    }

    // private  bool UploadFileToBrightSign(string filePath, string fileName, string sha1, LocalBrightSign lbs)
    // returns promise
    uploadFileToBrightSign(filePath, fileName, sha1) {

        const encodedFileName = encodeURIComponent(fileName);

        const hostname = "10.1.0.155";
        const endpoint = "/UploadFile";

        let headers = [];
        let header = {};

        header = {};
        header.key = "Destination-Filename";
        header.value = "pool/sha1-" + sha1;
        headers.push(header);

        header = {};
        header.key = "Friendly-Filename";
        header.value = encodedFileName;
        headers.push(header);

        return this.httpUploadFile(hostname, endpoint, filePath, fileName, headers);
    }

    getFilesToCopy(rawFilesToCopy) {

        let filesToCopy = [];

        if (rawFilesToCopy && rawFilesToCopy.filesToCopy && rawFilesToCopy.filesToCopy.file) {
            rawFilesToCopy.filesToCopy.file.forEach(file => {
                const fileName = file.fileName[0];
                const hashValue = file.hashValue[0];
                const fileSize = file.fileSize[0];

                const fileToPublish = new FileToPublish(file.filePath[0]);

                const fileSpec = new FileSpec(fileName, fileToPublish, hashValue, fileSize);

                filesToCopy.push(fileSpec);
            });
        }
        else {
            console.log("getFilesToCopy: no files to copy");
        }

        return filesToCopy;
    }

    // https://www.npmjs.com/package/request#multipartform-data-multipart-form-uploads
    httpUploadFile(hostname, endpoint, filePath, fileName, headers=[]) {

        var formData = {
            // Pass data via Streams
            file: fs.createReadStream(filePath),

            // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
            // Use case: for some types of streams, you'll need to provide "file"-related information manually.
            // See the `form-data` README for more information about options: https://github.com/form-data/form-data
        };

        let url = "http://10.1.0.155:8080" + endpoint;

        const myHeaders = {
        };

        headers.forEach( header => {
            myHeaders[header.key] = header.value;
        });

        return new Promise( (resolve, reject) => {
            request.post(
                {
                    url: url,
                    formData: formData,
                    headers: myHeaders
                },
                function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                        reject(err);

                    }
                    console.log('Upload successful!  Server responded with:', body);
                    var parser = new xml2js.Parser();
                    parser.parseString(body, function (err, jsonResponse) {
                        resolve(jsonResponse);
                    });

                });
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

            const listOfFilesXml = js2xmlparser("files", listOfFiles);

            // write to filesToPublish.xml in tmp dir
            const filePath = path.join(this.tmpDir, "filesToPublish.xml");
            fs.writeFile(filePath, listOfFilesXml, (err) => {
                if (err) {
                    debugger;
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
            }, function(err) {
                debugger;
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

