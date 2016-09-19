const path = require("path");

export default class LocalStoragePublisherUtils {

    constructor() {
    }

// public bool WriteLocalSyncSpec(string publishFolder, string xmlFileName, bool specifyLogging, bool specifyUSBContentUpdatePassword)
    writeLocalSyncSpec(publishFilesInSyncSpec, publishFolder, outputFileName, specifyLogging, specifyUSBContentUpdatePassword) {

        // set metadata, etc

        this.writeSyncSpecFilesSection(publishFilesInSyncSpec);


    }

    writeSyncSpecFilesSection(publishFilesInSyncSpec) {

        let syncSpecFiles = [];

        for (let filePath in publishFilesInSyncSpec) {

            let filePathSyncSpecEntries = publishFilesInSyncSpec[filePath];

            for (let fileName in filePathSyncSpecEntries) {
                let brightSignDownloadItem = filePathSyncSpecEntries[fileName];

                const filePath = brightSignDownloadItem.filePath;
                const sha1 = brightSignDownloadItem.hashValue;
                const fileSize = brightSignDownloadItem.fileSize;
                const groupName = brightSignDownloadItem.groupName;

                let download = {};

                download.name = fileName;

                let hash = {};
                hash.method = "SHA1";
                hash.value = sha1;
                download.hash = hash;

                let link = "";

                // if sfn

                debugger;

                link = "pool/" + this.GetPoolFilePath(String.Empty, sha1, false) + "sha1-" + sha1;
                download.link = link;
            }
        }
    }

    GetPoolFilePath(startDir, sha1, createDirectories) {

        let currentDir = startDir;
        let relativeFilePath = "";
        let poolDepth = 2;

        if (sha1.length >= poolDepth) {
            let folderIndex = 0;
            let folders = [];
            while (poolDepth > 0) {
                folders[folderIndex] = sha1.substring(sha1.length - poolDepth, sha1.length - poolDepth + 1);
                poolDepth--;

                // if (createDirectories) {
                //
                // }

                folderIndex++;
            }

            folders.forEach( folderName => {
                relativeFilePath = relativeFilePath + folderName + "/";
            });
        }

        return relativeFilePath;
    }
}


