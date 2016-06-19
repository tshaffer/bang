/**
 * Created by tedshaffer on 6/19/16.
 */
const fs = require('fs');

export let baDB = null;
const dbName = "BADatabase-17";

let badb_fd = null;
let badb_data = {};

export function openDB() {

    fs.open("badb", 'a', function(err, fd) {

        if (err) {
            console.log("failed to open badb");
        }
        else {
            console.log("successfully opened badb");
            badb_fd = fd;
        }
    });

    // use the following flags to determine when to resolve the promise
    let upgrading = false;
    let upgradeComplete = false;
    let success = false;

    return new Promise(function(resolve, reject) {

        var request = window.indexedDB.open(dbName, 3);

        request.onerror = function(event) {
            console.log("Database error: " + event.target.errorCode);
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
                    resolve();
                }
            }
        };

        request.onsuccess = function(event) {

            console.log("request.onsuccess invoked");
            let db = event.target.result;

            success = true;
            if (!upgrading || upgradeComplete) {
                baDB = db;

                const getThumbsPromise = dbGetThumbs();
                const getMediaLibraryFolder = dbGetMediaLibraryFolder();
                Promise.all([getThumbsPromise, getMediaLibraryFolder]).then(function(values) {
                    console.log("dbThumbs read complete");
                    console.log("write the information to a file");

                    badb_data.thumbsByPath = values[0];
                    badb_data.mediaLibraryFolder = values[1];

                    const badb_data_asString = JSON.stringify(badb_data, null, "\t");
                    console.log(badb_data_asString);

                    fs.writeFile(badb_fd, badb_data_asString, function(err) {
                        if (err) {
                            console.log("badb write error");
                        }
                        else {
                            console.log("badb saved");

                            fs.close(badb_fd, function(err) {
                                if (err) {
                                    console.log("badb close error");
                                }
                                else {
                                    console.log("badb closed properly");
                                }
                            })
                        }
                    });
                });
                resolve();
            }
        };
    });
}

// general purpose method to add a db record with key, value to the db
export function addRecordToDB ( objectStoreName, key, value ) {
    return new Promise(function(resolve, reject) {

        var request = baDB.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .add( value, key );

        request.onsuccess = function(event) {
            resolve(event);
        };

        request.onerror = function(event) {
            reject(event);
        }
    });
}

export function dbGetThumbs() {

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

export function dbGetMediaLibraryFolder() {

    let mediaFolder = "";

    return new Promise(function(resolve, reject) {

        const objectStore = baDB.transaction("mediaDirectory").objectStore("mediaDirectory");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.key == "currentMediaFolder" ) {
                    mediaFolder = cursor.value;
                }
                cursor.continue();
            }
            else {
                resolve(mediaFolder);
            }
        };
    })
}

export function dbSaveMediaFolder(mediaFolder) {

    var objectStore = baDB.transaction(["mediaDirectory"], "readwrite").objectStore("mediaDirectory");
    var request = objectStore.get("currentMediaFolder");

    request.onerror = function(event) {
        // currentMediaFolder record not found - add it
        addRecordToDB( "mediaDirectory", "currentMediaFolder", mediaFolder );
    };

    request.onsuccess = function(event) {

        // record found, update it
        var updateRequest = objectStore.put(mediaFolder, "currentMediaFolder");
        updateRequest.onerror = function(event) {
            console.log("error updating media folder");
            // TODO - error handling?
        };
        updateRequest.onsuccess = function(event) {
            // Success - the data is updated!
        };
    };
}
