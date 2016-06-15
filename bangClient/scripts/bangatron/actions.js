/**
 * Created by tedshaffer on 6/12/16.
 */
const fs = require('fs');
const path = require('path');

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
        const mediaFolderFiles = findMediaFiles(mediaFolder, mediaFolderFiles);
        dispatch(setMediaFolderFiles(mediaFolderFiles));
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





