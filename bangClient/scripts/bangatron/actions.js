const fs = require('fs');
const path = require('path');
const exifReader = require('./nodeExif');
const easyImage = require("easyimage");

var util = require("util");
var mime = require("mime");

import { setMediaThumbs, mergeMediaThumbs, setMediaFolder, openSign, setCurrentPlaylist, setMediaLibraryFiles } from '../actions/index';

import { openDB, addRecordToDB, dbGetThumbs, dbGetMediaLibraryFolder, dbSaveMediaFolder } from './db';

const mediaFileSuffixes = ['jpg'];

// used by bangatron
export function executeLoadAppData() {

    return function(dispatch) {

        openDB().then(function() {
            console.log("db successfully opened");
            fetchStartupData(dispatch);
        });
    }
}

function fetchStartupData(dispatch) {

    // startup data required for the app
    //      all media thumbs in the database, indexed by media file path
    //      last used media directory
    //      files in the last used media directory

    const mediaThumbs = getMediaThumbs();
    const mediaFolder = getMediaLibraryFolder();

    dispatch(setMediaThumbs(mediaThumbs));
    dispatch(setMediaFolder(mediaFolder));

    // get the files in the last used media folder
    let mediaFolderFiles = findFilesThenSetMediaLibraryFiles(dispatch, mediaFolder);
}


// builds and returns a data structure that maps file paths to thumbData objects
function getMediaThumbs() {

    return dbGetThumbs();
}


function getMediaLibraryFolder() {

    return dbGetMediaLibraryFolder();
}


function saveMediaFolder(mediaFolder) {

    return dbSaveMediaFolder(mediaFolder);
}


// TODO - rename me
function findFilesThenSetMediaLibraryFiles(dispatch, mediaFolder) {

    let mediaFiles = [];
    mediaFiles = findMediaFiles(mediaFolder, mediaFiles);
    dispatch(setMediaLibraryFiles(mediaFiles));
    return mediaFiles;
}


export function getThumb(filePath) {

    var data = fs.readFileSync(filePath).toString("base64");
    var base64Format = util.format("data:%s;base64,%s", mime.lookup(filePath), data);
    console.log("length of base64 string is: ", base64Format.length);
    return base64Format;
}

// invoked when the user selects a new media folder through the UI
export function executeSelectMediaFolder(mediaFolder, mediaThumbs) {

    return function(dispatch) {

        let mediaFolderFiles = findFilesThenSetMediaLibraryFiles(dispatch, mediaFolder);

        // make a list of thumbs that need to be created
        let thumbsToCreate = [];

        mediaFolderFiles.forEach(function(mediaFolderFile) {
            if (!mediaThumbs.hasOwnProperty(mediaFolderFile.filePath)) {
                // thumb doesn't exist for this file - mark it for creation
                thumbsToCreate.push(mediaFolderFile);
            }
        });

        if (thumbsToCreate.length > 0) {

            let thumbsByPathToMerge = {};

            let getThumbsPromise = getThumbs(thumbsToCreate);
            getThumbsPromise.then(function(mediaFilesWithThumbInfo) {
                // each entry in mediaFilesWithThumbInfo includes the following fields
                //      dateTaken
                //      fileName                backend_menu_Notes.jpg
                //      filePath                /Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg
                //      imageHeight
                //      imageWidth
                //      orientation
                //      thumbFileName           backend_menu_Notes_thumb.jpg
                //      thumbUrl                /thumbs/backend_menu_Notes_thumb.jpg
                // add each entry to the thumbFiles object store in the db

                let promises = [];
                mediaFilesWithThumbInfo.forEach( (mediaFileWithThumbInfo) => {
                    const thumbData = {
                        // fileName: mediaFileWithThumbInfo.fileName,
                        // thumbFileName: mediaFileWithThumbInfo.thumbFileName,
                        thumbPath: mediaFileWithThumbInfo.thumbPath,
                        modified: new Date()
                    };
                    let promise = addRecordToDB("thumbFiles", mediaFileWithThumbInfo.filePath, thumbData);
                    promises.push(promise);

                    thumbsByPathToMerge[mediaFileWithThumbInfo.filePath] = thumbData;
                });

                Promise.all(promises).then(function(values) {
                    console.log("added thumbs to db: count was ", promises.length);
                    console.log(values);

                    // TODO - it's not really necessary to wait for the db updates to invoke mergeMediaThumbs
                    dispatch(mergeMediaThumbs(thumbsByPathToMerge));
                });
            });
        }

        // update db with selectedMediaFolder
        saveMediaFolder(mediaFolder);

        // update store with selected media folder
        dispatch(setMediaFolder(mediaFolder));
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
        // mediaFile.thumbFileName = thumbFileName;

        // var thumbPath = path.join(__dirname, 'thumbs', mediaFile.thumbFileName);
        mediaFile.thumbPath = path.join('thumbs', thumbFileName);

        // TODO - thumbUrl needs to include dir to distinguish thumbs with the same file name
        // currently it's identical to thumbPath.
        // mediaFile.thumbUrl = path.join(__dirname, 'thumbs', mediaFile.thumbFileName);

        var createThumbPromise = easyImage.resize({
            src: mediaFile.filePath,
            dst: mediaFile.thumbPath,
            width: targetWidth,
            height: targetHeight,
            quality: 75
        });
        createThumbPromise.then(function (thumbImage) {
            // thumbImage is the object returned from easyimage - it's not used
            // console.log("created thumbnail " + thumbImage.name);
            resolve(thumbImage);
        });
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





