const fs = require('fs');
const path = require('path');
const exifReader = require('./nodeExif');
const easyImage = require("easyimage");

let baDB = null;
const dbName = "BADatabase-0";

import { setDB, openSign, setCurrentPlaylist, setMediaFolderFiles, setThumbFiles } from '../actions/index';

const mediaFileSuffixes = ['jpg'];

export function executeGetAllThumbs() {

    // check to see if the db has been opened yet
    if (baDB === null) {
        openDB().then(function(openedDB) {
            console.log("db successfully opened");
            baDB = openedDB;

            // now that db is open, fetch all the thumbs
            readThumbs().then(function(thumbs) {
                console.log("read thumbs");
            });
        });
    }
}

function readThumbs() {

    return new Promise(function(resolve, reject) {

        let thumbs = [];

        const objectStore = baDB.transaction("thumbFiles").objectStore("thumbFiles");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {

                let thumb = {};
                thumb[cursor.key] = cursor.value;
                thumbs.push(thumb);
                cursor.continue();
            }
            else {
                resolve(thumbs);
            }
        };
    })
}

function openDB() {

    return new Promise(function(resolve, reject) {

        var request = window.indexedDB.open(dbName, 4);

        request.onerror = function(event) {
            // TODO - what??
            alert("Database error: " + event.target.errorCode);
            reject();
        };

        request.onupgradeneeded = function(event) {

            console.log("openDB.onupgradeneeded invoked");
            let db = event.target.result;

            var store = db.createObjectStore("thumbFiles");

            store.transaction.oncomplete = function(event) {
                console.log("createObjectStore transaction complete");

                // // Store values in the newly created objectStore.
                // var transaction = db.transaction(["thumbFiles"], "readwrite");
                //
                // var request = objectStore.add();
                // request.onsuccess = function(event) {
                //     // event.target.result == customerData[i].ssn;
                // };
                // var thumbFilesObjectStore = db.transaction("thumbFiles", "readwrite").objectStore("thumbFiles");
                // thumbFilesObjectStore.add("thumb1.jpg", "/users/tedshaffer/Projects/thumb1.jpg");
                // thumbFilesObjectStore.add("thumb2.jpg", "/users/tedshaffer/Projects/thumb2.jpg");
            };
        };

        request.onsuccess = function(event) {
            // Do something with request.result!
            console.log("request.onsuccess invoked");
            let db = event.target.result;

            // var tx = this.db.transaction("thumbFiles", "readwrite");
            // let objectStore = tx.objectStore("thumbFiles");
            // var request = objectStore.add("/users/tedshaffer/Projects/thumb3.jpg", "thumb3");
            // request.onsuccess = function(event) {
            //     console.log("add success 1");
            //     console.log("add success 2");
            //     var returnedKey = event.target.result;
            //     console.log("returnedKey=", returnedKey);
            // };

            // var objectStore = db.transaction("thumbFiles").objectStore("thumbFiles");
            //
            // objectStore.openCursor().onsuccess = function(event) {
            //     var cursor = event.target.result;
            //     if (cursor) {
            //         console.log("Item " + cursor.key + " is " + cursor.value);
            //         cursor.continue();
            //     }
            //     else {
            //         console.log("No more entries!");
            //     }
            // };

            resolve(db);
        };
    });
}

export function executeOpenDB() {

    return function(dispatch) {

        console.log("openDB");

        // indexedDB tests
        var request = window.indexedDB.open(dbName, 4);

        request.onerror = function(event) {
            // TODO - what??
            alert("Database error: " + event.target.errorCode);
        };

        request.onupgradeneeded = function(event) {

            console.log("openDB.onupgradeneeded invoked");
            const db = event.target.result;

            var store = db.createObjectStore("thumbFiles");

            store.transaction.oncomplete = function(event) {
                console.log("createObjectStore transaction complete");

                // // Store values in the newly created objectStore.
                // var transaction = db.transaction(["thumbFiles"], "readwrite");
                //
                // var request = objectStore.add();
                // request.onsuccess = function(event) {
                //     // event.target.result == customerData[i].ssn;
                // };
                // var thumbFilesObjectStore = db.transaction("thumbFiles", "readwrite").objectStore("thumbFiles");
                // thumbFilesObjectStore.add("thumb1.jpg", "/users/tedshaffer/Projects/thumb1.jpg");
                // thumbFilesObjectStore.add("thumb2.jpg", "/users/tedshaffer/Projects/thumb2.jpg");
            };
        };

        request.onsuccess = function(event) {
            // Do something with request.result!
            console.log("request.onsuccess invoked");
            const db = event.target.result;
            dispatch(setDB(db));

            // var tx = this.db.transaction("thumbFiles", "readwrite");
            // let objectStore = tx.objectStore("thumbFiles");
            // var request = objectStore.add("/users/tedshaffer/Projects/thumb3.jpg", "thumb3");
            // request.onsuccess = function(event) {
            //     console.log("add success 1");
            //     console.log("add success 2");
            //     var returnedKey = event.target.result;
            //     console.log("returnedKey=", returnedKey);
            // };

            // var objectStore = db.transaction("thumbFiles").objectStore("thumbFiles");
            //
            // objectStore.openCursor().onsuccess = function(event) {
            //     var cursor = event.target.result;
            //     if (cursor) {
            //         console.log("Item " + cursor.key + " is " + cursor.value);
            //         cursor.continue();
            //     }
            //     else {
            //         console.log("No more entries!");
            //     }
            // };
        };
    }
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

export function executeSelectMediaFolder(mediaFolder) {

    let mediaFolderFiles = [];

    return function(dispatch) {

        // retrieve the files in the selected media folder
        const mediaFolderFiles = findMediaFiles(mediaFolder, mediaFolderFiles);
        dispatch(setMediaFolderFiles(mediaFolderFiles));

        // given the list of files, get thumbs for each of them
        getThumbs(mediaFolderFiles).then(function(mediaFilesWithThumbInfo) {

            console.log("executeSelectMediaFolder - number of mediaFiles with thumbs=", mediaFilesWithThumbInfo.length);

            let thumbFilesByFilePath = {};
            mediaFilesWithThumbInfo.forEach(function(mediaFileWithThumbInfo) {
                thumbFilesByFilePath[mediaFileWithThumbInfo.filePath] = mediaFileWithThumbInfo;
            });
            dispatch(setThumbFiles(mediaFilesWithThumbInfo));
        });
    }
}

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


function getThumbs(mediaFiles) {

    return new Promise(function(resolve, reject) {

        var getExifDataPromise = exifReader.getAllExifData(mediaFiles);
        getExifDataPromise.then(function(mediaFilesWithExif) {
            console.log("getExifDataPromised resolved");
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






