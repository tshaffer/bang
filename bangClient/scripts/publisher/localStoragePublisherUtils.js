const fs = require("fs");
const path = require("path");
const js2xmlparser = require("js2xmlparser2");

export default class LocalStoragePublisherUtils {

    constructor() {
    }

// public bool WriteLocalSyncSpec(string publishFolder, string xmlFileName, bool specifyLogging, bool specifyUSBContentUpdatePassword)
    writeLocalSyncSpec(publishFilesInSyncSpec, publishFolder, xmlFileName, specifyLogging = false, specifyUSBContentUpdatePassword = false) {

        // Publisher/LocalStoragePublisherUtils.cs

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
                syncSpec.files.push(file);
            });

// WriteIgnoreSections
            // issue with delete, ignore in xml
            // json -> xml converter: when it converts an array, it needs each item in the array to have the same label (download, not download or delete or ignore)
            //
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
            // could write these entries in manually if needed - blech!


            // convert json to xml
            var options = {
                wrapArray: {
                    enabled: true,
                    elementName: "download"
                }
            };
            let xmlAsStr = js2xmlparser('sync', syncSpec, options);

            // hacks go here
            xmlAsStr = xmlAsStr.replace(/<sync>/i, '<sync version="1.0">');

            // add the following
            // <delete>
            //     <pattern>*.brs</pattern>
            // </delete>
            // <delete>
            // <pattern>*.rok</pattern>
            // </delete>
            // <delete>
            // <pattern>*.bsfw</pattern>
            // </delete>
            // <ignore>
            // <pattern>*</pattern>
            // </ignore>
            const newLine = "\r\n";

            let deleteIgnore = "";
            deleteIgnore += "<files>" + newLine;
            deleteIgnore += "\t\t<delete>" + newLine;
            deleteIgnore += "\t\t\t<pattern>*.brs</pattern>" + newLine;
            deleteIgnore += "\t\t</delete>" + newLine;
            deleteIgnore += "\t\t<delete>" + newLine;
            deleteIgnore += "\t\t\t<pattern>*.bsfw</pattern>" + newLine;
            deleteIgnore += "\t\t</delete>" + newLine;
            deleteIgnore += "\t\t<ignore>" + newLine;
            deleteIgnore += "\t\t\t<pattern>*</pattern>" + newLine;
            deleteIgnore += "\t\t</ignore>";
            xmlAsStr = xmlAsStr.replace(/<files>/i, deleteIgnore);

            debugger;

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


