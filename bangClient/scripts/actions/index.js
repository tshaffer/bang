/**
 * Created by tedshaffer on 6/3/16.
 */

import axios from 'axios';
import fetch from 'isomorphic-fetch';

import Sign from '../badm/sign';
import ImagePlaylistItem from '../badm/imagePlaylistItem';

// electron only
// const fs = require('fs');

export const CREATE_DEFAULT_SIGN = 'CREATE_DEFAULT_SIGN'
export function createDefaultSign() {

    // create a default sign
    const sign = new Sign("Project 1");
    const currentPlaylist = sign.zones[0].zonePlaylist;
    const signData = { sign: sign, currentPlaylist: currentPlaylist };
    
    return {
        type: CREATE_DEFAULT_SIGN,
        payload: signData
    }
}

export const OPEN_SIGN = 'OPEN_SIGN'
export function openSign(sign) {
    
    console.log("actions::openSign");
    
    return {
        type: OPEN_SIGN,
        payload: sign
    }
}

export function fetchBSNSign(presentationName) {

    return function(dispatch) {

        const getBSNPresentationUrl = "http://localhost:6969/getBSNPresentation";

        return axios.get(getBSNPresentationUrl, {
            params: { name: presentationName }
        }).then(function(data) {
            console.log("fetchBSNSign - return from server call");

            const signAsJson = data.data.bsnPresentation;
            const sign = JSON.parse(signAsJson);
            dispatch(openSign(sign));
            dispatch(setCurrentPlaylist(sign.zones[0].zonePlaylist));
        })
    }
}

// export function fetchSign(filePath) {
//
//     return function (dispatch) {
//
//         console.log("fetchSign, filePath=", filePath);
//
//         fs.readFile(filePath, 'utf8', (err, data) => {
//
//             // TODO - proper error handling?
//             if (err) {
//                 throw err;
//                 return;
//             }
//             console.log("fs.ReadFile successful");
//             var sign = JSON.parse(data);
//             dispatch(openSign(sign));
//             dispatch(setCurrentPlaylist(sign.zones[0].zonePlaylist));
//         })
//     }
// }


// TODO - currently doesn't do anything with redux. If it never does, where should it live?
export function saveBSNPresentation(name, sign) {
    
    return function(dispatch) {
        
        const saveBSNPresentationUrl = "http://localhost:6969/saveBSNPresentation";
        
        return axios.get(saveBSNPresentationUrl, {
            params: { name: name, sign: sign }
        }).then(function() {
            console.log("savePresentation - return from server call");
        })
    }
}


export const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST'
export function setCurrentPlaylist(playlist) {

    return {
        type: SET_CURRENT_PLAYLIST,
        payload: playlist
    }
}

export const ADD_PLAYLIST_ITEM = 'ADD_PLAYLIST_ITEM';
export function addPlaylistItem(playlist, playlistItem, index) {

    if (index >= 0) {
        // insert prior to index
        playlist.playlistItems.splice(index, 0, playlistItem);
    }
    else {
        // append to list
        playlist.playlistItems.push(playlistItem);
    }

    return {
        type: ADD_PLAYLIST_ITEM,
        payload: playlist
    }
}

export const SET_MEDIA_FOLDER = 'SET_MEDIA_FOLDER'
export function setMediaFolder(mediaFolder) {
    return {
        type: SET_MEDIA_FOLDER,
        payload: mediaFolder
    }
}

export const SET_MEDIA_LIBRARY_FILES = 'SET_MEDIA_LIBRARY_FILES';
export function setMediaLibraryFiles(mediaLibraryFiles) {

    let mediaLibraryPlaylistItems = [];
    let mediaItemThumbs = {};

    mediaLibraryFiles.forEach( mediaLibraryFile =>
    {
        const fileName = mediaLibraryFile.fileName;
        const id = mediaLibraryFile.id;
        const filePath = mediaLibraryFile.mediaFilePath;
        const mediaFolder = mediaLibraryFile.mediaFolder;

        const imagePlaylistItem = new ImagePlaylistItem(fileName, filePath);
        mediaLibraryPlaylistItems.push(imagePlaylistItem);

        mediaItemThumbs[mediaLibraryFile.mediaFilePath] = mediaLibraryFile.thumbFileName;
    });

    const payload = {
        mediaLibraryPlaylistItems,
        mediaItemThumbs
    };

    return {
        type: SET_MEDIA_LIBRARY_FILES,
        payload: payload
    }
}

function getMediaFiles(dispatch, mediaFolder) {

    dispatch(setMediaFolder(mediaFolder));

    const getThumbsUrl = "http://localhost:6969/" + "getThumbs";

    return axios.get(getThumbsUrl, {
        params: { mediaFolder: mediaFolder }
    }).then(function(data) {
        dispatch(setMediaLibraryFiles(data.data.thumbs));
    });
}


export function updateMediaFolder(mediaFolder) {

    return function(dispatch) {

        const updateMediaFolderUrl = "http://localhost:6969/" + "updateMediaFolder";
        axios.get(updateMediaFolderUrl, {
            params: { mediaFolder: mediaFolder }
        }).then(function() {

            return getMediaFiles(dispatch, mediaFolder);
        })
    }
}


export function fetchMediaFolder() {

    return function (dispatch) {

        fetch(`http://localhost:6969/getMediaFolder`)
            .then(response => response.json())
            .then(function(data) {
                return getMediaFiles(dispatch, data.mediaFolder);
            });
    }
};
