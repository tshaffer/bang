/**
 * Created by tedshaffer on 6/3/16.
 */
import { getLastKey } from '../utilities/utils';

import axios from 'axios';

import ImageMediaItem from '../entities/imageMediaItem';

import { executeLoadAppData, executeFetchSign, executeSelectMediaFolder, getFileName, executeSaveSign } from '../platform/actions';

export function loadAppData() {
    return executeLoadAppData();
}

export function saveSign(filePath) {
    return executeSaveSign(filePath);
}

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
export function newSign(name, videoMode) {

    const signData =
    {
        name,
        videoMode
    };

    return {
        type: NEW_SIGN,
        payload: signData
    }
}

export const OPEN_SIGN = 'OPEN_SIGN';
export function openSign(name, videoMode) {

    const signData =
    {
        name,
        videoMode
    };

    return {
        type: OPEN_SIGN,
        payload: signData
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

export const NEW_HTML_SITE = 'NEW_HTML_SITE';
export function newHtmlSite(htmlSite) {

    return {
        type: NEW_HTML_SITE,
        payload: htmlSite
    }
}

export const ADD_HTML_SITE = 'ADD_HTML_SITE';
export function addHtmlSite(htmlSiteId) {

    return {
        type: ADD_HTML_SITE,
        payload: htmlSiteId
    }
}

export const NEW_ZONE = 'NEW_ZONE';
export function newZone(name, type) {

    const zoneData =
    {
        name,
        type
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

export const CLEAR_ZONE_PLAYLISTS = 'CLEAR_ZONE_PLAYLISTS';
export function clearZonePlaylists() {
    return {
        type: CLEAR_ZONE_PLAYLISTS
    }
}

export const NEW_ZONE_PLAYLIST = 'NEW_ZONE_PLAYLIST';
export function newZonePlaylist() {

    return {
        type: NEW_ZONE_PLAYLIST
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

export const CLEAR_PLAYLIST_ITEMS = 'CLEAR_PLAYLIST_ITEMS';
export function clearPlaylistItems() {
    return {
        type: CLEAR_PLAYLIST_ITEMS
    }
}

export const NEW_MEDIA_STATE = 'NEW_MEDIA_STATE';
export function newMediaState(mediaState) {
    return {
        type: NEW_MEDIA_STATE,
        payload: mediaState
    }
}

// export const ADD_TRANSITION = 'ADD_TRANSITION';
// export function addTransition(sourceMediaStateId, destinationMediaStateId) {
//     return {
//         type: ADD_TRANSITION,
//         sourceMediaStateId: sourceMediaStateId,
//         destinationMediaStateId: destinationMediaStateId
//     }
// }

export const UPDATE_MEDIA_STATE = 'UPDATE_MEDIA_STATE';
export function updateMediaState(mediaStateId, mediaState) {
    return {
        type: UPDATE_MEDIA_STATE,
        mediaStateId: mediaStateId,
        mediaState: mediaState
    }
}

export const NEW_PLAYLIST_ITEM = 'NEW_PLAYLIST_ITEM';
export function newPlaylistItem(playlistItem) {
    return {
        type: NEW_PLAYLIST_ITEM,
        payload: playlistItem
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

    return {
        type: ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST,
        zonePlaylistId: zonePlaylistId,
        playlistItemId: playlistItemId,
        index: index
    }
}

export const ADD_MEDIA_STATE_TO_ZONE_PLAYLIST = 'ADD_MEDIA_STATE_TO_ZONE_PLAYLIST';
export function addMediaStateToZonePlaylist(zonePlaylistId, mediaStateId) {

    return {
        type: ADD_MEDIA_STATE_TO_ZONE_PLAYLIST,
        zonePlaylistId: zonePlaylistId,
        mediaStateId: mediaStateId
    }
}

export const DELETE_PLAYLIST_ITEM = 'DELETE_PLAYLIST_ITEM';
export function deletePlaylistItem(zonePlaylistId, playlistItemId) {
    return {
        type: DELETE_PLAYLIST_ITEM,
        zonePlaylistId: zonePlaylistId,
        playlistItemId: playlistItemId
    }
}

export const MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST = 'MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST';
export function movePlaylistItemWithinZonePlaylist(zonePlaylistId, sourceIndex, destinationIndex) {

    return {
        type: MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST,
        zonePlaylistId: zonePlaylistId,
        sourceIndex: sourceIndex,
        destinationIndex: destinationIndex
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

// export const ADD_TRANSITION = 'ADD_TRANSITION';
// export function addTransition(sourceMediaStateId, destinationMediaStateId) {
//     return {
//         type: ADD_TRANSITION,
//         sourceMediaStateId: sourceMediaStateId,
//         destinationMediaStateId: destinationMediaStateId
//     }
// }
// inputs
//      sourceMediaState (exists in store)
//      targeMediaState (exists in store)
//      transition (doesn't exist in store)
//  actions
//      add transition to store
//      add transition id to sourceMediaState's transitionOutIds
//      add transition id to destinationMediaState's transitionInIds

export const NEW_TRANSITION = 'NEW_TRANSITION';
export function newTransition(transition) {

    return {
        type: NEW_TRANSITION,
        transition
    }
}

export const ADD_TRANSITION_OUT = 'ADD_TRANSITION_OUT';
export function addTransitionOut(sourceMediaState, transitionId) {

    return {
        type: ADD_TRANSITION_OUT,
        sourceMediaState,
        transitionId
    }
}

export const ADD_TRANSITION_IN = 'ADD_TRANSITION_IN';
export function addTransitionIn(targetMediaState, transitionId) {

    return {
        type: ADD_TRANSITION_IN,
        targetMediaState,
        transitionId
    }
}

export const DELETE_TRANSITION_OUT = 'DELETE_TRANSITION_OUT';
export function deleteTransitionOut(mediaState, transitionId) {

    return {
        type: DELETE_TRANSITION_OUT,
        mediaState,
        transitionId
    }
}

export const DELETE_TRANSITION = 'DELETE_TRANSITION';
export function deleteTransition(transitionId) {

    return {
        type: DELETE_TRANSITION,
        transitionId
    }
}

export const DELETE_MEDIA_STATE = 'DELETE_MEDIA_STATE';
function deleteAMediaState(zonePlaylistId, mediaStateId) {

    return {
        type: DELETE_MEDIA_STATE,
        zonePlaylistId: zonePlaylistId,
        mediaStateId: mediaStateId
    }

}
export function deleteMediaState(zonePlaylistId, mediaState) {

    // for each transition in
    //      find all references to the transition from other media states' transition out's
    //          delete those transition out references
    //      delete the transition
    // delete the media state
    return function (dispatch, getState) {

        const state = getState();

        mediaState.transitionInIds.forEach(function(transitionInId) {

            for (let mediaStateId in state.mediaStates.mediaStatesById) {
                if (state.mediaStates.mediaStatesById.hasOwnProperty(mediaStateId)) {
                    const otherMediaState = state.mediaStates.mediaStatesById[mediaStateId];
                    otherMediaState.transitionOutIds.forEach(function(transitionOutId) {
                        if (transitionOutId === transitionInId) {
                            // delete this transition out reference from otherMediaState
                            dispatch(deleteTransitionOut(otherMediaState, transitionOutId));
                        }
                    });
                }
            }
            dispatch(deleteTransition(transitionInId));
        });

        dispatch(deleteAMediaState(zonePlaylistId, mediaState.getId()));
    }
}

export function addTransition(sourceMediaState, transition, targetMediaState) {

    return function (dispatch, getState) {

        dispatch(newTransition(transition));

        let nextState = getState();
        // getLastKey was not built for an array, but still might work.
        const transitionId = getLastKey(nextState.transitions.transitionsById);

        dispatch(addTransitionOut(sourceMediaState, transitionId));
        dispatch(addTransitionIn(targetMediaState, transitionId));
    }
}

export function createDefaultPresentation(presentationName) {

    return function (dispatch, getState) {

        dispatch(newSign(presentationName, "1920x1080x60p"));
        dispatch(newZone("Images", "images"));

        let nextState = getState();
        const zoneId = getLastKey(nextState.zones.zonesById);
        dispatch(addZone(zoneId));

        nextState = getState();
        const zone = nextState.zones.zonesById[zoneId];

        dispatch(newZonePlaylist());

        nextState = getState();
        const zonePlaylistId = getLastKey(nextState.zonePlaylists.zonePlaylistsById);

        dispatch(setZonePlaylist(zoneId, zonePlaylistId));
    }
}

export function fetchSign(signId) {
    return executeFetchSign(signId);
}

export function addHtmlSiteToPresentation(htmlSite) {

    return function(dispatch, getState) {

        dispatch(newHtmlSite(htmlSite));

        let nextState = getState();
        const htmlSiteId = getLastKey(nextState.htmlSites.htmlSitesById);
        dispatch(addHtmlSite(htmlSiteId));

        nextState = getState();
    }
}

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

// currently unused
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



