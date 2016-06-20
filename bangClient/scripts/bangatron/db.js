/**
 * Created by tedshaffer on 6/19/16.
 */
const fs = require('fs');

export let baDB = null;
const dbName = "BADatabase-17";

let badb_data = {};

export function openDB() {

    return new Promise(function(resolve, reject) {
        fs.readFile("badb", (err, data) => {
            if (err) {
                console.log("failed to read badb");
                reject(err);
            }
            badb_data = JSON.parse(data);
            resolve();
        });
    });
}

function saveDB() {

    return new Promise(function(resolve, reject) {
        const badb_data_asString = JSON.stringify(badb_data, null, "\t");

        fs.writeFile("badb", badb_data_asString, function(err) {
            if (err) {
                console.log("badb write error");
                reject(err);
            }
            else {
                console.log("badb saved");
                resolve();
            }
        });
    });
}

// general purpose method to add a db record with key, value to the db
export function addRecordToDB ( objectStoreName, key, value ) {

    return new Promise(function(resolve, reject) {

        // TODO - fix up names - 'thumbFiles' or 'thumbsByPath'?
        if (objectStoreName == "thumbFiles") {
            badb_data.thumbsByPath[key] = value;
            saveDB().then(function() {
                console.log("addRecordToDB: success");
                resolve();
            });
        }
    });
}

export function dbGetThumbs() {

    return badb_data.thumbsByPath;
}

export function dbGetMediaLibraryFolder() {

    return badb_data.mediaLibraryFolder;
}

export function dbSaveMediaFolder(mediaFolder) {

    badb_data.mediaLibraryFolder = mediaFolder;
    saveDB().then(function() {
        console.log("dbSaveMediaFolder: success");
    });
}
