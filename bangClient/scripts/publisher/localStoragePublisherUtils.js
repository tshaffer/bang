const path = require("path");
const js2xmlparser = require("js2xmlparser");

export default class LocalStoragePublisherUtils {

    constructor() {
    }

// public bool WriteLocalSyncSpec(string publishFolder, string xmlFileName, bool specifyLogging, bool specifyUSBContentUpdatePassword)
    writeLocalSyncSpec(publishFilesInSyncSpec, publishFolder, outputFileName, specifyLogging, specifyUSBContentUpdatePassword) {

        // Publisher/LocalStoragePublisherUtils.cs

        // set metadata, etc

        let syncSpec = {};
        syncSpec.meta = {};
        syncSpec.meta.enableSerialDebugging = true;
        syncSpec.files = [];

        let files = this.writeSyncSpecFilesSection(publishFilesInSyncSpec);
        files.forEach(file => {
            let downloadItem = {};
            syncSpec.files.push(
                {
                    download: file
                }
            );
        });

        // convert json to xml if needed
        // let poo = js2xmlparser.parse("sync", syncSpec);
    }

    writeSyncSpecFilesSection(publishFilesInSyncSpec) {

        let files = [];

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


                const hashMethod =
                    {
                        "method": "SHA1"
                    };
                hash["@"] = hashMethod;
                hash["#"] = sha1;
                download.hash = hash;

                download.size = fileSize;

                let link = "";
                // if sfn, blah blah blah
                link = "pool/" + this.GetPoolFilePath(String.Empty, sha1, false) + "sha1-" + sha1;
                download.link = link;

                if (groupName != "") {
                    download.groupName = groupName;
                }

                // if (BrightAuthorUtils.IsVideoFile(bsdi.FilePath) || BrightAuthorUtils.IsAudioFile(bsdi.FilePath))
                // {
                //     string probeData = ProbeWrapper.GetProbeData(bsdi.FilePath);
                //     writer.WriteElementString("probe", probeData);
                //     Trace.WriteLine("Probe data for " + bsdi.FilePath + " is " + probeData);
                // }

                // if (sfn) {
                //     blah blah blah
                // }

                files.push(download);
            }
        }

        return files;
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


