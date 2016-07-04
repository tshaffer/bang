const fs = require('fs');
const path = require('path');
const exifReader = require('./nodeExif');
const easyImage = require("easyimage");

var util = require("util");
var mime = require("mime");

import { setMediaThumbs, mergeMediaThumbs, setMediaFolder, openSign, setMediaLibraryFiles } from '../actions/index';

import { openDB, addRecordToDB, dbGetThumbs, dbGetMediaLibraryFolder, dbSaveMediaFolder } from './db';
import { newZone, addZone, clearZonePlaylists, newZonePlaylist, setZonePlaylist, clearPlaylistItems, newPlaylistItem, addPlaylistItem, getLastKey } from '../actions/index';

import Sign from '../badm/sign';
import Zone from '../badm/zone';
import ImagePlaylistItem from '../badm/imagePlaylistItem';

const mediaFileSuffixes = ['jpg'];

// used by bangatron
export function executeLoadAppData() {

    return function(dispatch) {

        openDB().then(function() {
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


export function getThumb(mediaItem) {

    const filePath = mediaItem.thumbPath;
    const data = fs.readFileSync(filePath).toString("base64");
    const base64Format = util.format("data:%s;base64,%s", mime.lookup(filePath), data);
    // console.log("length of base64 string is: ", base64Format.length);
    return base64Format;
}

// invoked when the user selects a new media folder through the UI
export function executeSelectMediaFolder(mediaFolder, mediaThumbs) {

    return function(dispatch, getState) {

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
            var buildThumbnailsPromise = buildThumbnails(mediaFilesWithExif);
            buildThumbnailsPromise.then(function(obj) {

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

        mediaFile.thumbPath = path.join('thumbs', thumbFileName);

        var createThumbPromise = easyImage.resize({
            src: mediaFile.filePath,
            dst: mediaFile.thumbPath,
            width: targetWidth,
            height: targetHeight,
            quality: 75
        });
        createThumbPromise.then(function (thumbImage) {
            // thumbImage is the object returned from easyimage - it's not used
            resolve(thumbImage);
        });
    });
}

export function executeFetchSign(filePath) {

    return function (dispatch, getState) {

        console.log("fetchSign, filePath=", filePath);

        let nextState = null;

        // get data in badm format
        fs.readFile(filePath, 'utf8', (err, data) => {

            // TODO - proper error handling?
            if (err) {
                throw err;
                return;
            }
            console.log("fs.ReadFile successful");

            // NOT A REAL badmSIGN - just a json object
            const jsonSign = JSON.parse(data);

            // convert to real sign - better way?
            let badmSign = new Sign(jsonSign.name);
            badmSign.videoMode = jsonSign.videoMode;

            jsonSign.zones.forEach( jsonZone => {
                let badmZone = new Zone(jsonZone.name, jsonZone.type);
                badmSign.zones.push(badmZone);

                let badmZonePlaylist = badmZone.zonePlaylist;

                jsonZone.zonePlaylist.playlistItems.forEach( jsonPlaylistItem => {
                    const imagePlaylistItem = new ImagePlaylistItem(jsonPlaylistItem.fileName,jsonPlaylistItem.filePath,
                        jsonPlaylistItem.timeOnScreen, jsonPlaylistItem.transition, jsonPlaylistItem.transitionDuration, jsonPlaylistItem.videoPlayerRequired);
                    badmZonePlaylist.playlistItems.push(imagePlaylistItem);
                })
            });

            dispatch(clearZonePlaylists());
            dispatch(clearPlaylistItems());

            dispatch(openSign(badmSign.name, badmSign.videoMode));
            badmSign.zones.forEach( badmZone => {

                dispatch(newZone(badmZone.name, badmZone.type));

                nextState = getState();
                const zoneId = getLastKey(nextState.zones.zonesById);
                dispatch(addZone(zoneId));

                nextState = getState();
                const zone = nextState.zones.zonesById[zoneId];

                dispatch(newZonePlaylist());
                nextState = getState();
                const zonePlaylistId = getLastKey(nextState.zonePlaylists.zonePlaylistsById);

                dispatch(setZonePlaylist(zoneId, zonePlaylistId));

                badmZone.zonePlaylist.playlistItems.forEach( badmPlaylistItem => {
                    dispatch(newPlaylistItem(badmPlaylistItem));
                    dispatch(addPlaylistItem(zonePlaylistId, badmPlaylistItem.id));
                });
            } );

            // nextState = getState();
        })
    }
}


export function getFileName(filePath) {
    return path.basename(filePath);

}


export function executeSaveSign(filePath) {

    return function (dispatch, getState) {
        
        const state = getState();

        let badmSign = new Sign(state.sign.name, state.sign.videoMode);

        state.sign.zoneIds.forEach( zoneId => {

            const zone = state.zones.zonesById[zoneId];
            let badmZone = new Zone(zone.name, zone.type);
            badmSign.addZone(badmZone);

            const badmZonePlaylist = badmZone.zonePlaylist;

            const zonePlaylist = state.zonePlaylists.zonePlaylistsById[zone.zonePlaylistId];
            zonePlaylist.playlistItemIds.forEach(playlistItemId => {
                const playlistItem = state.playlistItems.playlistItemsById[playlistItemId];
                // TODO only support imagePlaylistItems now
                let badmPlaylistItem = new ImagePlaylistItem(playlistItem.fileName, playlistItem.filePath, playlistItem.timeOnScreen, playlistItem.transition, playlistItem.transitionDuration, "false");
                badmZonePlaylist.playlistItems.push(badmPlaylistItem);
            });
        })

        const presentation = JSON.stringify(badmSign, null, 2);

        fs.writeFile(filePath, presentation, () => {
            console.log("bpf writeFile successful");
        })
    }
}


