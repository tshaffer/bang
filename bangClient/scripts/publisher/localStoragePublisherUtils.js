const fs = require("fs");
const path = require("path");
const js2xmlparser = require("js2xmlparser2");

export default class LocalStoragePublisherUtils {

    constructor() {
    }

// public bool WriteLocalSyncSpec(string publishFolder, string xmlFileName, bool specifyLogging, bool specifyUSBContentUpdatePassword)
    writeLocalSyncSpec(publishFilesInSyncSpec, publishFolder, xmlFileName, specifyLogging = false, specifyUSBContentUpdatePassword = false) {

        // Publisher/LocalStoragePublisherUtils.cs

        // set metadata, etc

        return new Promise( (resolve, reject) => {
            let syncSpec = {};

            syncSpec.meta = {};
            syncSpec.meta.client = {};
            syncSpec.meta.client.enableSerialDebugging = true;
            syncSpec.meta.client.enableSystemLogDebugging = false;
            syncSpec.meta.client.limitStorageSpace = false;

            syncSpec.files = [];


            let files = this.buildSyncSpecFilesSection(publishFilesInSyncSpec);
            files.forEach(file => {
                // syncSpec.files.push(
                //     {
                //         download: file
                //     }
                // );
                syncSpec.files.push(file);
            });

            debugger;

            // let entries = this.buildDeleteIgnoreSections();
            // entries.forEach( entry => {
            //    if ("delete" in entry) {
            //        syncSpec.files.push(
            //            {
            //                delete: entry["delete"]
            //            }
            //        )
            //
            //    }
            //    else if ("ignore" in entry) {
            //        syncSpec.files.push(
            //            {
            //                ignore: entry["ignore"]
            //            }
            //        )
            //    };
            // });


            // also in files
            // <ignore>
            //     <pattern>*</pattern>
            // </ignore>

            // convert json to xml if needed
            // const xmlAsStr = js2xmlparser.parse("sync", syncSpec);
            var options = {
                wrapArray: {
                    enabled: true,
                    elementName: "download"
                }
            };
            const xmlAsStr = js2xmlparser("sync", syncSpec, options);
            const filePath = path.join(publishFolder, xmlFileName);
            fs.writeFile(filePath, xmlAsStr, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(xmlFileName, " successfully written");
                resolve("ok");
            });
        });
    }

    buildSyncSpecFilesSection(publishFilesInSyncSpec) {

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

    buildDeleteIgnoreSections(files) {

        let entries = [];

        entries.push( { delete: { pattern: "*.brs" }});
        entries.push( { delete: { pattern: "*.rok" }});
        entries.push( { delete: { pattern: "*.bsfw" }});
        entries.push( { ignore: { pattern: "*" }});

        return entries;
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


