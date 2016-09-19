const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

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
    }

    publishToLWS() {

        const mediaDir = "/Users/tedshaffer/Documents/bang/media";
        let filePath = "";

        this.filesToTransferViaLWS = [];
        this.publishFilesInSyncSpec = {};

        // media files
        filePath = path.join(mediaDir, "Colorado.jpg");
        this.addFileToLWSPublishList("Colorado.jpg", filePath, "");

        filePath = path.join(mediaDir, "GlacierNationalPark.jpg");
        this.addFileToLWSPublishList("GlacierNationalPark.jpg", filePath, "");

        filePath = path.join(mediaDir, "BryceCanyonUtah.jpg");
        this.addFileToLWSPublishList("BryceCanyonUtah.jpg", filePath, "");

        // ok = WriteLocalSyncSpec(PublishFolder, "new-local-sync.xml", false, false);

        this.localStoragePublisherUtils.writeLocalSyncSpec(this.publishFilesInSyncSpec);

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

        const fileSizeInBytes = this.getFileSizeInBytes(filePath);
        console.log("fileSize:", fileSizeInBytes);

        const getSHA1Promise = this.getSHA1OfFile(filePath);
        getSHA1Promise.then(sha1 => {

            const fileToPublish = new FileToPublish(filePath);
            const fileSpec = new FileSpec(fileName, fileToPublish, sha1, fileSizeInBytes);

            this.filesToTransferViaLWS.push(fileSpec);
            this.addToLocalSyncSpecList(fileName, filePath, fileSizeInBytes, sha1, groupName);
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

