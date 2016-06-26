/**
 * Created by tedshaffer on 6/3/16.
 */
import { guid } from '../utilities/utils';

import axios from 'axios';

import Sign from '../badm/sign';
import ImageMediaItem from '../badm/imageMediaItem';

import { executeLoadAppData, executeFetchSign, executeSelectMediaFolder, getFileName } from '../platform/actions';

export function loadAppData() {

    return executeLoadAppData();
}


// invoked when the user selects a new media folder through the UI
export function selectMediaFolder(mediaFolder, mediaThumbs) {
    return executeSelectMediaFolder(mediaFolder, mediaThumbs);
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
        const fileName = getFileName(mediaFolderFile.filePath);
        const imageMediaItem = new ImageMediaItem(fileName, mediaFolderFile.filePath);
        mediaLibraryPlaylistItems.push(imageMediaItem);
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
        type: MERGE_MEDIA_THUMBS,
        payload: thumbsByPath
    }
}







export const NEW_SIGN = 'NEW_SIGN';
export function newSign(id, name) {

    // create a default sign
    // const sign = new Sign(signName);

    const signData =
    {
        id: id,
        name: name
    }
    return {
        type: NEW_SIGN,
        payload: signData
    }
}

export const NEW_ZONE = 'NEW_ZONE';
export function newZone(id, type, name) {

    const zoneData = {
        id: id,
        type: type,
        name: name
    };
    
    return {
        type: NEW_ZONE,
        payload: zoneData
    }
}

// assumes there is a single, defined sign
export const ADD_ZONE = 'ADD_ZONE';
export function addZone(zoneId) {

    return {
        type: ADD_ZONE,
        payload: zoneId
    }
}

export const SET_SELECTED_ZONE = 'SET_SELECTED_ZONE';
export function selectZone(zone) {
    return {
        type: SET_SELECTED_ZONE,
        payload: zone
    }
}

export const NEW_ZONE_PLAYLIST = 'NEW_ZONE_PLAYLIST';
export function newZonePlaylist(id) {

    const zonePlaylist = {
        id: id
    };

    return {
        type: NEW_ZONE_PLAYLIST,
        payload: zonePlaylist
    }
}

export const SET_ZONE_PLAYLIST = 'SET_ZONE_PLAYLIST';
export function setZonePlaylist(zoneId, zonePlaylistId) {

    const payload = {
        zoneId: zoneId,
        zonePlaylistId: zonePlaylistId
    };

    return {
        type: SET_ZONE_PLAYLIST,
        payload: payload
    }
}

export const NEW_PLAYLIST_ITEM = 'NEW_PLAYLIST_ITEM';
export function newPlaylistItem(playlistItem) {
    return {
        type: NEW_PLAYLIST_ITEM,
        payload: playlistItem
    }
}

export const UPDATE_PLAYLIST_ITEM = 'UPDATE_PLAYLIST_ITEM';
export function updatePlaylistItem(playlistItemId, playlistItem) {
    return {
        type: UPDATE_PLAYLIST_ITEM,
        playlistItemId: playlistItemId,
        playlistItem: playlistItem
    }
}





export const ADD_PLAYLIST_ITEM = 'ADD_PLAYLIST_ITEM';
export function addPlaylistItem(zonePlaylistId, playlistItemId) {
    return {
        type: ADD_PLAYLIST_ITEM,
        zonePlaylistId: zonePlaylistId,
        playlistItemId: playlistItemId
    }
}


export const ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST = 'ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST';
export function addPlaylistItemToZonePlaylist(zonePlaylistId, playlistItemId, index) {

    // if (index >= 0) {
    //     // insert prior to index
    //     playlist.playlistItems.splice(index, 0, playlistItem);
    // }
    // else {
    //     // append to list
    //     playlist.playlistItems.push(playlistItem);
    // }

    return {
        type: ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST,
        zonePlaylistId: zonePlaylistId,
        playlistItemId: playlistItemId,
        index: index
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

export const UPDATE_SIGN = 'UPDATE_SIGN';
export function updateSign(sign) {

    console.log("actions::updateSign");

    return {
        type: UPDATE_SIGN,
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


export const ADD_HTML_SITE = 'ADD_HTML_SITE';
export function addHtmlSite(htmlSite) {
    
    return {
        type: ADD_HTML_SITE,
        payload: htmlSite
    }
}


