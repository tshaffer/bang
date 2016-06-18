/**
 * Created by tedshaffer on 6/3/16.
 */

import axios from 'axios';
import fetch from 'isomorphic-fetch';

import Sign from '../badm/sign';
import ImagePlaylistItem from '../badm/imagePlaylistItem';

import { executeLoadAppData, executeFetchSign, executeSelectMediaFolder } from '../platform/actions';

export function loadAppData() {

    return executeLoadAppData();
}


// invoked when the user selects a new media folder through the UI
export function selectMediaFolder(mediaFolder, mediaItemThumbs) {
    return executeSelectMediaFolder(mediaFolder, mediaItemThumbs);
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

    mediaLibraryFiles.forEach(function(mediaFolderFile) {
        const imagePlaylistItem = new ImagePlaylistItem(mediaFolderFile.fileName, mediaFolderFile.filePath);
        mediaLibraryPlaylistItems.push(imagePlaylistItem);
    });

    return {
        type: SET_MEDIA_LIBRARY_FILES,
        payload: mediaLibraryPlaylistItems
    }
}


export const SET_MEDIA_THUMBS = 'SET_MEDIA_THUMBS';
export function setMediaThumbs(thumbsByPath) {

    return {
        type: SET_MEDIA_THUMBS,
        payload: thumbsByPath
    }
}

export const MERGE_MEDIA_THUMBS = 'MERGE_MEDIA_THUMBS';
export function mergeMediaThumbs(thumbsByPath) {

    return {
        type: MERGE_THUMBS,
        payload: thumbsByPath
    }
}




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


export function fetchSign(signId) {
    return executeFetchSign(signId);
}

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




