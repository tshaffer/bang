const fs = require('fs');
const path = require('path');
const exifReader = require('./nodeExif');
const easyImage = require("easyimage");

let baDB = null;
const dbName = "BADatabase-17";

import { setDB, openSign, setCurrentPlaylist, setMediaLibraryFiles, setThumbFiles, setAllThumbs, mergeThumbs, setMediaFolder } from '../actions/index';

const mediaFileSuffixes = ['jpg'];

// used by bangatron
export function executeLoadAppData() {

    return function(dispatch) {
        
        // open db if it's not open yet
        if (baDB === null) {
            openDB().then(function(openedDB) {
                console.log("db successfully opened");
                baDB = openedDB;

                fetchStartupData(dispatch);
            });
        }
    }
}

// used by bangatron
function fetchStartupData(dispatch) {

    // startup data required for the app
    //      all thumbs in the database, indexed by media file path
    //      last used media directory
    //      files in the last used media directory

    let readThumbsPromise = readThumbs();
    let getMediaDirectoryPromise = readMediaDirectory();

    Promise.all([readThumbsPromise, getMediaDirectoryPromise]).then(function(values) {

        console.log("readThumbs and readMediaDirectory complete");
        console.log("number of thumbs is " + values[0].length);
        console.log("media folder is " + values[1]);
        dispatch(setAllThumbs(values[0]));
        dispatch(setMediaFolder(values[1]));

        // get the files in the last used media folder
        let mediaFolder = values[1];

        // instead of doing this, executeSelectMediaFolder should get called
        let mediaFolderFiles = [];
        mediaFolderFiles = findMediaFiles(mediaFolder, mediaFolderFiles);
        dispatch(setMediaLibraryFiles(mediaFolderFiles));
    });
}


// used by bangatron
function readMediaDirectory() {

    let mediaDirectory = "";

    return new Promise(function(resolve, reject) {

        const objectStore = baDB.transaction("mediaDirectory").objectStore("mediaDirectory");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.key == "currentMediaFolder" ) {
                    mediaDirectory = cursor.value;
                }
                cursor.continue();
            }
            else {
                resolve(mediaDirectory);
            }
        };
    })
}

function updateMediaFolderInDB(mediaFolder) {

    var objectStore = baDB.transaction(["mediaDirectory"], "readwrite").objectStore("mediaDirectory");
    var request = objectStore.get("currentMediaFolder");

    request.onerror = function(event) {
        // Handle errors!
        addRecordToDB( "mediaDirectory", "currentMediaFolder", mediaFolder );
    };

    request.onsuccess = function(event) {

        // Get the old value that we want to update
        var data = request.result;

        // Put this updated object back into the database.
        var requestUpdate = objectStore.put(mediaFolder, "currentMediaFolder");
        requestUpdate.onerror = function(event) {
            console.log("error updating media folder");
            // Do something with the error
        };
        requestUpdate.onsuccess = function(event) {
            console.log("success updating media folder");
            // Success - the data is updated!
        };
    };


}

// used by bangatron
function readThumbs() {

    return new Promise(function(resolve, reject) {

        let thumbs = {};

        const objectStore = baDB.transaction("thumbFiles").objectStore("thumbFiles");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                thumbs[cursor.key] = cursor.value;
                cursor.continue();
            }
            else {
                resolve(thumbs);
            }
        };
    })
}


// used by bangatron
function addRecordToDB ( objectStoreName, key, value ) {
    return new Promise(function(resolve, reject) {

        var request = baDB.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .add( value, key );

        request.onsuccess = function(event) {
            console.log("record added to db");
            resolve(event);
        };

        request.onerror = function(event) {
            console.log("unable to add record to db");
            reject(event);
        }
    });
}


// used by bangatron
function openDB() {

    // use the following flags to determine when to resolve the promise
    let upgrading = false;
    let upgradeComplete = false;
    let success = false;

    return new Promise(function(resolve, reject) {

        var request = window.indexedDB.open(dbName, 3);

        request.onerror = function(event) {
            alert("Database error: " + event.target.errorCode);
            reject();
        };

        request.onupgradeneeded = function(event) {

            console.log("XXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            return;
            upgrading = true;
            let mediaDirectoryWritesComplete = false;
            let thumbFilesWritesComplete = false;

            console.log("openDB.onupgradeneeded invoked");
            baDB = event.target.result;

            var thumbFilesStore = baDB.createObjectStore("thumbFiles");
            var mediaDirectoryStore = baDB.createObjectStore("mediaDirectory");

            mediaDirectoryStore.transaction.oncomplete = function(event) {
                // BOGUS - need key, value pair
                let mediaDirectoryStorePromise = addRecordToDB("mediaDirectory", "/Users/tedshaffer/Pictures/BangPhotos2");
                mediaDirectoryStorePromise.then(function(event) {
                    console.log("mediaDirectory record added");
                    mediaDirectoryWritesComplete = true;
                });
            }

            thumbFilesStore.transaction.oncomplete = function(event) {
                console.log("createObjectStore transaction complete");

                let mediaFilePath = "";
                let thumbData = {};

                mediaFilePath = "/Users/tedshaffer/Pictures/BangPhotos2/amsterdam(8).JPG";
                thumbData = {
                    fileName: "amsterdam(8).JPG",
                    thumbFileName: "amsterdam(8)_thumb.JPG",
                    mediaFolder: "/Users/tedshaffer/Pictures/BangPhotos2",
                    url: "/Users/tedshaffer/Documents/Projects/bang/bangServer/thumbs/amsterdam(8)_thumb.JPG",
                    lastModified: "2016-06-05 13:49:04.423Z"
                };
                var promise0 = addRecordToDB("thumbFiles", mediaFilePath, thumbData);

                mediaFilePath = "/Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg";
                thumbData = {
                    fileName: "backend_menu_Notes.jpg",
                    thumbFileName: "backend_menu_Notes_thumb.jpg",
                    mediaFolder: "/Users/tedshaffer/Pictures/BangPhotos2",
                    url: "/Users/tedshaffer/Documents/Projects/bang/bangServer/thumbs/backend_menu_Notes_thumb.jpg",
                    lastModified: "2016-06-05 13:49:04.423Z"
                };
                var promise1 = addRecordToDB("thumbFiles", mediaFilePath, thumbData);

                mediaFilePath = "/Users/tedshaffer/Pictures/BangPhotos2/WindRiverRange.jpg";
                thumbData = {
                    fileName: "WindRiverRange.jpg",
                    thumbFileName: "WindRiverRange_thumb.jpg",
                    mediaFolder: "/Users/tedshaffer/Pictures/BangPhotos2",
                    url: "/Users/tedshaffer/Documents/Projects/bang/bangServer/thumbs/WindRiverRange_thumb.jpg",
                    lastModified: "2016-06-05 13:49:04.423Z"
                };
                var promise2 = addRecordToDB("thumbFiles", mediaFilePath, thumbData);

                Promise.all([promise0, promise1, promise2]).then(function(values) {
                    // all the media files have been written to the db
                    thumbFilesWritesComplete = true;
                });
            };

            if (mediaDirectoryWritesComplete && thumbFilesWritesComplete) {
                upgradeComplete = true;

                if (success) {
                    resolve(baDB);
                }
            }
        };

        request.onsuccess = function(event) {

            console.log("request.onsuccess invoked");
            let db = event.target.result;

            success = true;
            if (!upgrading || upgradeComplete) {
                resolve(db);
            }
        };
    });
}

export function executeFetchSign(filePath) {

    return function (dispatch) {

        console.log("fetchSign, filePath=", filePath);

        fs.readFile(filePath, 'utf8', (err, data) => {

            // TODO - proper error handling?
            if (err) {
                throw err;
                return;
            }
            console.log("fs.ReadFile successful");
            var sign = JSON.parse(data);
            dispatch(openSign(sign));
            dispatch(setCurrentPlaylist(sign.zones[0].zonePlaylist));
        })
    }
}

// invoked when the user selects a new media folder through the UI
export function executeSelectMediaFolder(mediaFolder, mediaItemThumbs) {

    return function(dispatch) {

        // copied from fetchStartupData
        let mediaFolderFiles = [];
        mediaFolderFiles = findMediaFiles(mediaFolder, mediaFolderFiles);
        dispatch(setMediaLibraryFiles(mediaFolderFiles));

        // make a list of thumbs that need to be created
        let thumbsToCreate = [];

        mediaFolderFiles.forEach(function(mediaFolderFile) {
            if (!mediaItemThumbs.hasOwnProperty(mediaFolderFile.filePath)) {
                // thumb doesn't already exist for this file - create it
                thumbsToCreate.push(mediaFolderFile);
            }
        });

        console.log("need to create " + thumbsToCreate.length);
        console.log("do it carefully");

        if (thumbsToCreate.length > 0) {

            let thumbsByPathToMerge = {};

            let getThumbsPromise = getThumbs(thumbsToCreate);
            getThumbsPromise.then(function(mediaFilesWithThumbInfo) {
                console.log("mediaFilesWithThumbInfo returned");
                console.log(mediaFilesWithThumbInfo);

                // at this point, each entry in mediaFilesWithThumbInfo includes the following fields
                //      dateTaken
                //      fileName                backend_menu_Notes.jpg
                //      filePath                /Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg
                //      imageHeight
                //      imageWidth
                //      orientation
                //      thumbFileName           backend_menu_Notes_thumb.jpg
                //      thumbUrl                /thumbs/backend_menu_Notes_thumb.jpg
                // add each of these to the thumbFiles db

                let promises = [];
                mediaFilesWithThumbInfo.forEach( (mediaFileWithThumbInfo) => {
                    const thumbData = {
                        fileName: mediaFileWithThumbInfo.fileName,
                        thumbFileName: mediaFileWithThumbInfo.thumbFileName,
                        mediaFolder: "",
                        url: "",
                        lastModified: ""
                    };
                    let promise = addRecordToDB("thumbFiles", mediaFileWithThumbInfo.filePath, thumbData);

                    thumbsByPathToMerge[mediaFileWithThumbInfo.filePath] = thumbData;
                });

                Promise.all(promises).then(function(values) {
                    console.log("added thumbs to db: count was ", promises.length);
                    console.log(values);

                    dispatch(mergeThumbs(thumbsByPathToMerge));

                });
            });
        }

        // update db with selectedMediaFolder
        updateMediaFolderInDB(mediaFolder);

        // update store with selected media folder
        dispatch(setMediaFolder(mediaFolder));

    }
}


// used by bangatron (fetchStartupData - code there needs to be pulled out)
function findMediaFiles(dir, mediaFiles) {

    var files = fs.readdirSync(dir);
    mediaFiles = mediaFiles || [];

    files.forEach(function(file) {
        if (!fs.statSync(dir + '/' + file).isDirectory()) {
            // add it if it's a media file but not if it's a thumbnail
            mediaFileSuffixes.forEach(function(suffix) {
                if (file.toLowerCase().endsWith(suffix)) {
                    var mediaFile = {};

                    mediaFile.fileName = file;
                    mediaFile.filePath = path.join(dir, file);
                    mediaFiles.push(mediaFile);
                }
            });
        }
    });
    return mediaFiles;
};


// used by executeSelectMediaFolder
function getThumbs(mediaFiles) {

    return new Promise(function(resolve, reject) {

        var getExifDataPromise = exifReader.getAllExifData(mediaFiles);
        getExifDataPromise.then(function(mediaFilesWithExif) {
            console.log("getExifDataPromised resolved");
            console.log("check files here");
            var buildThumbnailsPromise = buildThumbnails(mediaFilesWithExif);
            buildThumbnailsPromise.then(function(obj) {
                console.log("thumbnails build complete");
                console.log("number of thumbsnails created=", mediaFilesWithExif.length);

                // at this point, each entry in mediaFilesWithExif includes the following fields
                //      dateTaken
                //      fileName                backend_menu_Notes.jpg
                //      filePath                /Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg
                //      imageHeight
                //      imageWidth
                //      orientation
                //      thumbFileName           backend_menu_Notes_thumb.jpg
                //      thumbUrl                /thumbs/backend_menu_Notes_thumb.jpg
                resolve(mediaFilesWithExif);
            });
        });
    });
}


// build thumbs for the media library
function buildThumbnails(mediaFiles) {

    var fileCount = mediaFiles.length;

    return new Promise(function(resolve, reject) {

        var sequence = Promise.resolve();

        mediaFiles.forEach(function(mediaFile) {
            // Add these actions to the end of the sequence
            sequence = sequence.then(function() {
                return buildThumb(mediaFile);
            }).then(function(imageFile) {
                fileCount--;
                console.log("fileCount=" + fileCount);
                if (fileCount == 0) {
                    resolve(null);
                }
            });
        });
    });
}


function buildThumb(mediaFile) {

    return new Promise(function(resolve, reject) {

        var targetHeight = 100;
        var targetWidth = mediaFile.imageWidth / (mediaFile.imageHeight / targetHeight);

        var dirName = path.dirname(mediaFile.filePath);
        var fileName = path.basename(mediaFile.filePath);
        var ext = path.extname(mediaFile.filePath);

        var thumbFileName = fileName.substring(0,fileName.length - ext.length) + "_thumb" + ext;
        mediaFile.thumbFileName = thumbFileName;

        // var thumbPath = path.join(__dirname, 'thumbs', mediaFile.thumbFileName);
        // TODO - bogus, but hopefully will use indexeddb anyway - don't use dirName because it's '/'??
        var thumbPath = path.join('thumbs', mediaFile.thumbFileName);

        // TODO - thumbUrl needs to include dir to distinguish thumbs with the same file name
        // currently it's identical to thumbPath.
        mediaFile.thumbUrl = path.join(__dirname, 'thumbs', mediaFile.thumbFileName);

        var createThumbPromise = easyImage.resize({
            src: mediaFile.filePath,
            dst: thumbPath,
            width: targetWidth,
            height: targetHeight,
            quality: 75
        });
        createThumbPromise.then(function (thumbImage) {
            // thumbImage is the object returned from easyimage - it's not used
            console.log("created thumbnail " + thumbImage.name);
            resolve(thumbImage);
        });
    });
}






