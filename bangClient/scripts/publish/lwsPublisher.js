const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

export function publishToLWS() {

    const mediaDir = "/Users/tedshaffer/Documents/bang/media";

    let filePath = path.join(mediaDir, "Colorado.jpg");

    console.log("basename:", path.basename(filePath));
    console.log("dirname:", path.dirname(filePath));
    console.log("extname:", path.extname(filePath));

    const formattedPath =
        path.format({
            dir: mediaDir,
            base: 'Colorado.jpg'
        });
    console.log("formattedPath:", formattedPath);

    const fileSize = getFileSizeInBytes(filePath);
    console.log("fileSize:", fileSize);

    const sha1Promise = getSHA1OfFile(filePath);
    sha1Promise.then( sha1 => {
        console.log("sha1:", sha1);
        debugger;
    });

}

// various sha1 packages
// https://www.npmjs.com/package/sha1
// https://www.npmjs.com/package/node-sha1

// https://gist.github.com/thinkphp/5110833
function getSHA1Hash( data ) {
    const generator = crypto.createHash('sha1');
    generator.update( data );
    return generator.digest('hex');
}

// https://nodejs.org/api/crypto.html
// https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
function getSHA1OfFile(filePath) {

    return new Promise( (resolve, reject) => {
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

function getFileSizeInBytes(filePath) {
    var stats = fs.statSync(filePath);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
}

// List<FileSpec> filesToTransferViaLWS, string fileName, string filePath, string groupName
function AddFileToLWSPublishList(filesToTransferViaLWS, fileName, filePath, groupName) {

    debugger;

    const fileSizeInBytes = getFileSizeInBytes(filePath);

    // string sha1 = BrightAuthorUtils.GetSHA1Hash(filePath);
    const sha1 = getSHA1OfFile(filePath);
}

