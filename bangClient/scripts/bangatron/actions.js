/**
 * Created by tedshaffer on 6/12/16.
 */
const fs = require('fs');
const path = require('path');
const exifReader = require('./nodeExif');
const easyImage = require("easyimage");

import { openSign, setCurrentPlaylist, setMediaFolderFiles } from '../actions/index';

const mediaFileSuffixes = ['jpg'];

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
        getThumbs(mediaFolderFiles);
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

    var getExifDataPromise = exifReader.getAllExifData(mediaFiles);
    getExifDataPromise.then(function(mediaFilesWithExif) {
        console.log("getExifDataPromised resolved");
        var buildThumbnailsPromise = buildThumbnails(mediaFilesWithExif);
        buildThumbnailsPromise.then(function(obj) {
            console.log("thumbnails build complete");
            // TODO - what's in mediaFiles - can't access it from debugger.
            // var saveThumbsPromise = dbController.saveThumbsToDB(mediaFilesToAdd);
            // saveThumbsPromise.then(function(thumbSpecs) {
            //     var response = {};
            //     response.thumbs = thumbSpecs;
            //
            //     existingThumbs.forEach(function(existingThumb) {
            //         response.thumbs.push(existingThumb);
            //     });
            //
            //     res.send(response);
            // });
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






