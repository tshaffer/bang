const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

import FileSpec from '../entities/fileSpec';
import FileToPublish from '../entities/fileToPublish';

export default class LWSPublisher {

    constructor() {
    }

    publishToLWS() {

        const mediaDir = "/Users/tedshaffer/Documents/bang/media";

        let filePath = path.join(mediaDir, "Colorado.jpg");

        this.AddFileToLWSPublishList(null, "Colorado.jpg", filePath, "");
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

// List<FileSpec> filesToTransferViaLWS, string fileName, string filePath, string groupName
    AddFileToLWSPublishList(filesToTransferViaLWS, fileName, filePath, groupName) {

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

            debugger;

            const fileToPublish = new FileToPublish(filePath);
            const fileSpec = new FileSpec(fileName, fileToPublish, sha1, fileSizeInBytes);
        });


        //     filesToTransferViaLWS.Add(
        //         new FileSpec
        //         {
        //             FileName = fileName,
        //                 FileToPublish = new SimpleFileToPublish { FilePath = filePath },
        //             HashValue = sha1,
        //                 FileSize = fileSize
        //         }
        //     );
        //     AddToLocalSyncSpecList(fileName, filePath, sha1, groupName);

    }
}

