/**
 * Created by tedshaffer on 6/3/16.
 */
import { getLastKey } from '../utilities/utils';

import axios from 'axios';

import ImageMediaItem from '../entities/imageMediaItem';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import MediaState from '../badm/mediaState';
import UserEvent from '../badm/userEvent';
import Transition from '../badm/transition';

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

export const SET_MEDIA_FOLDER = 'SET_MEDIA_FOLDER';
export function setMediaFolder(mediaFolder) {
    return {
        type: SET_MEDIA_FOLDER,
        payload: mediaFolder
    };
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
    };
}

export const SET_MEDIA_THUMBS = 'SET_MEDIA_THUMBS';
export function setMediaThumbs(thumbsByPath) {

    return {
        type: SET_MEDIA_THUMBS,
        payload: thumbsByPath
    };
}

export const MERGE_MEDIA_THUMBS = 'MERGE_MEDIA_THUMBS';
export function mergeMediaThumbs(thumbsByPath) {

    return {
        type: MERGE_MEDIA_THUMBS,
        payload: thumbsByPath
    };
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
    };
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
    };
}

export const UPDATE_SIGN = 'UPDATE_SIGN';
export function updateSign(sign) {

    console.log("actions::updateSign");

    return {
        type: UPDATE_SIGN,
        payload: sign
    };
}

export const NEW_HTML_SITE = 'NEW_HTML_SITE';
export function newHtmlSite(htmlSite) {

    return {
        type: NEW_HTML_SITE,
        payload: htmlSite
    };
}

export const ADD_HTML_SITE = 'ADD_HTML_SITE';
export function addHtmlSite(htmlSiteId) {

    return {
        type: ADD_HTML_SITE,
        payload: htmlSiteId
    };
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
    };
}

// assumes there is a single, defined sign
export const ADD_ZONE = 'ADD_ZONE';
export function addZone(zoneId) {

    return {
        type: ADD_ZONE,
        payload: zoneId
    };
}

export const NEW_ZONE_PLAYLIST = 'NEW_ZONE_PLAYLIST';
export function newZonePlaylist() {

    return {
        type: NEW_ZONE_PLAYLIST
    };
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
    };
}

export const NEW_MEDIA_STATE = 'NEW_MEDIA_STATE';
export function newMediaState(mediaState) {
    return {
        type: NEW_MEDIA_STATE,
        payload: mediaState
    };
}

export const UPDATE_MEDIA_STATE = 'UPDATE_MEDIA_STATE';
export function updateMediaState(mediaStateId, mediaState) {
    return {
        type: UPDATE_MEDIA_STATE,
        mediaStateId: mediaStateId,
        mediaState: mediaState
    };
}

export const SET_INITIAL_MEDIA_STATE = 'SET_INITIAL_MEDIA_STATE';
export function setInitialMediaState(zonePlaylistId, mediaStateId) {

    return {
        type: SET_INITIAL_MEDIA_STATE,
        zonePlaylistId: zonePlaylistId,
        mediaStateId: mediaStateId
    };
}

export const NEW_TRANSITION = 'NEW_TRANSITION';
export function newTransition(transition) {

    return {
        type: NEW_TRANSITION,
        transition
    };
}

export const ADD_TRANSITION_OUT = 'ADD_TRANSITION_OUT';
export function addTransitionOut(sourceMediaState, transitionId) {

    return {
        type: ADD_TRANSITION_OUT,
        sourceMediaState,
        transitionId
    };
}

export const ADD_TRANSITION_IN = 'ADD_TRANSITION_IN';
export function addTransitionIn(targetMediaState, transitionId) {

    return {
        type: ADD_TRANSITION_IN,
        targetMediaState,
        transitionId
    };
}

export const DELETE_TRANSITION_IN = 'DELETE_TRANSITION_IN';
export function deleteTransitionIn(mediaState, transitionId) {

    return {
        type: DELETE_TRANSITION_IN,
        mediaState,
        transitionId
    };
}


export const DELETE_TRANSITION_OUT = 'DELETE_TRANSITION_OUT';
export function deleteTransitionOut(mediaState, transitionId) {

    return {
        type: DELETE_TRANSITION_OUT,
        mediaState,
        transitionId
    };
}

export const DELETE_TRANSITION = 'DELETE_TRANSITION';
export function deleteTransition(transitionId) {

    return {
        type: DELETE_TRANSITION,
        transitionId
    };
}

function deleteAMediaState(zonePlaylistId, mediaStateId) {

    return {
        type: DELETE_MEDIA_STATE,
        zonePlaylistId: zonePlaylistId,
        mediaStateId: mediaStateId
    };
}

export const UPDATE_IMAGE_TIME_ON_SCREEN = 'UPDATE_IMAGE_TIME_ON_SCREEN';
export function updateImageTimeOnScreen(mediaStateId, timeOnScreen) {

    return {
        type: UPDATE_IMAGE_TIME_ON_SCREEN,
        mediaStateId,
        timeOnScreen
    };
}

export const UPDATE_IMAGE_TRANSITION = 'UPDATE_IMAGE_TRANSITION';
export function updateImageTransition(mediaStateId, transition) {

    return {
        type: UPDATE_IMAGE_TRANSITION,
        mediaStateId,
        transition
    };
}

export const UPDATE_IMAGE_TRANSITION_DURATION = 'UPDATE_IMAGE_TRANSITION_DURATION';
export function updateImageTransitionDuration(mediaStateId, transitionDuration) {

    return {
        type: UPDATE_IMAGE_TRANSITION_DURATION,
        mediaStateId,
        transitionDuration
    };
}

export const DELETE_MEDIA_STATE = 'DELETE_MEDIA_STATE';

export function deleteMediaStateFromNonInteractivePlaylist(zonePlaylistId, mediaState) {

    // after deleting the media state, the code needs to
    //      create a transition from the preceding to the succeeding state
    //      potentially update the initialImageState


    return function (dispatch, getState) {

        let state = getState();

        let transitionInId = null;
        let transitionOutId = null;

        if (mediaState.transitionInIds.length === 1) {
            transitionInId = mediaState.transitionInIds[0];
        }
        if (mediaState.transitionOutIds.length === 1) {
            transitionOutId = mediaState.transitionOutIds[0];
        }

        // if transitionInId === null, then the media state getting deleted is the first media state in the playlist
        // if transitionInId === null && if transitionOutId !== null, then its target media state will become the first media state in the playlist
        // else the list is empty after the deletion

        if (transitionInId && transitionOutId) {
            // not deleting first state - create a transition between these two states.
            const transitionIn = state.transitions.transitionsById[transitionInId];
            const sourceMediaState = state.mediaStates.mediaStatesById[transitionIn.sourceMediaStateId];

            const transitionOut = state.transitions.transitionsById[transitionOutId];
            const targetMediaState = state.mediaStates.mediaStatesById[transitionOut.targetMediaStateId];

            const userEvent = new UserEvent("timeout");
            userEvent.setValue("5");

            const transition = new Transition(sourceMediaState, userEvent, targetMediaState);
            dispatch(addTransition(sourceMediaState, transition, targetMediaState));

            state = getState();
        }
        else if (!transitionInId && transitionOutId) {
            // deleting first state
            const transitionOut = state.transitions.transitionsById[transitionOutId];
            // const targetMediaState = state.mediaStates.mediaStatesById[transitionOut.targetMediaStateId];
            dispatch(setInitialMediaState(zonePlaylistId, transitionOut.targetMediaStateId));

        }

        deleteMediaState(dispatch, state, zonePlaylistId, mediaState);

    };


}
function deleteMediaState(dispatch, state, zonePlaylistId, mediaState) {

    // for each transition in
    //      find all references to the transition from other media states' transition out's
    //          delete those transition out references
    //      delete the transition
    // delete the media state

    // pseudo code for how I think it should work
    // for each transitionOut from the selected media state
    //      delete the transition from the mediaState.transitionInIds of the target mediaState for this transitionOut
    //      add the transitionOut to the list of transitions outs to delete
    //      dispatch the delete
    //      iterate through all media states
    //          for each transitionIn to the mediaState
    //              if it matches the transitionOut, delete this transition In
    // for each transitionIn to the selected media state
    //      iterate through all other media states
    //          iterate through their transition out id's
    //              if one of their transitionOutId's matches the transitionInId of the selected media state
    //                  add the transition to the list of transitions to delete
    //                  delete the transitionOut from the mediaState.transitionOutIds of the other media state for this transitionIn
    // beginning of new code
    let transitionsToDelete = [];
    mediaState.transitionOutIds.forEach(function(transitionOutId) {
        const transition = state.transitions.transitionsById[transitionOutId];
        const targetMediaStateId = transition.targetMediaStateId;
        const targetMediaState = state.mediaStates.mediaStatesById[targetMediaStateId];
        dispatch(deleteTransitionOut(mediaState, transitionOutId));
        transitionsToDelete.push(transitionOutId);

        for (let mediaStateId in state.mediaStates.mediaStatesById) {
            if (state.mediaStates.mediaStatesById.hasOwnProperty(mediaStateId)) {
                const targetMediaState = state.mediaStates.mediaStatesById[mediaStateId];
                targetMediaState.transitionInIds.forEach(function(transitionInId) {
                    if (transitionInId == transitionOutId) {
                        // delete the transitionInId from this mediaState
                        dispatch(deleteTransitionIn(targetMediaState, transitionInId));
                    }
                });
            }
        }
    });

    mediaState.transitionInIds.forEach(function(transitionInId) {
        for (let mediaStateId in state.mediaStates.mediaStatesById) {
            if (state.mediaStates.mediaStatesById.hasOwnProperty(mediaStateId)) {
                const sourceMediaState = state.mediaStates.mediaStatesById[mediaStateId];
                sourceMediaState.transitionOutIds.forEach(function(transitionOutId) {
                    if (transitionOutId === transitionInId) {
                        // delete this transition out reference from otherMediaState
                        dispatch(deleteTransitionOut(sourceMediaState, transitionOutId));
                    }
                });
            }
        }
        dispatch(deleteTransitionIn(mediaState, transitionInId));
    });

    transitionsToDelete.forEach(transitionToDelete => {
        dispatch(deleteTransition(transitionToDelete));
    });

    // end of new code

    // before deleting the media state
    //      check to see if it's the initial media state
    //      if it is, change the initial media state to a valid media state
    //      heuristic - if the media state getting deleted is the initial media state, either there are no other
    //      media states or (at least for a non interactive playlist), a valid media state is one that was the target media state of
    //      the one getting deleted.
    // if (state.zonePlaylists.zonePlaylistsById[zonePlaylistId].initialMediaStateId == mediaState.getId()) {
    //     dispatch(setInitialMediaState(zonePlaylistId, targetMediaStateId));
    // }

    dispatch(deleteAMediaState(zonePlaylistId, mediaState.getId()));
}

export function addTransition(sourceMediaState, transition, targetMediaState) {

    return function (dispatch, getState) {

        dispatch(newTransition(transition));

        const transitionId = transition.id;
        dispatch(addTransitionOut(sourceMediaState, transitionId));
        dispatch(addTransitionIn(targetMediaState, transitionId));
    };
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
    };
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
    };
}

export function saveBSNPresentation(name, sign) {
    
    return function(dispatch) {
        
        const saveBSNPresentationUrl = "http://localhost:6969/saveBSNPresentation";
        
        return axios.get(saveBSNPresentationUrl, {
            params: { name: name, sign: sign }
        }).then(function() {
            console.log("savePresentation - return from server call");
        });
    };
}

// currently unused
// export function updateMediaFolder(mediaFolder) {
//
//     return function(dispatch) {
//
//         const updateMediaFolderUrl = "http://localhost:6969/" + "updateMediaFolder";
//         axios.get(updateMediaFolderUrl, {
//             params: { mediaFolder: mediaFolder }
//         }).then(function() {
//
//             return getMediaFiles(dispatch, mediaFolder);
//         });
//     };
// }



function getMediaStateAt(state, selectedZonePlaylist, targetIndex) {

    const transitionsById = state.transitions.transitionsById;

    let currentIndex = 0;
    let mediaStateId = selectedZonePlaylist.initialMediaStateId;
    const mediaStatesById = state.mediaStates.mediaStatesById;

    let mediaState = mediaStatesById[mediaStateId];

    while (currentIndex < targetIndex) {
        // code could be safer here but this **should** always work
        const transitionOutId = mediaState.transitionOutIds[0];
        const transition = transitionsById[transitionOutId];
        mediaStateId = transition.targetMediaStateId;
        mediaState = mediaStatesById[mediaStateId];
        currentIndex++;
    }

    return mediaState;
}

function getMediaState(state, mediaStateId) {
    return state.mediaStates.mediaStatesById[mediaStateId];
}

export function addMediaStateToNonInteractivePlaylist(selectedZonePlaylist, operation, type, stateName, path, sourceIndex, destinationIndex) {

    // initial implementation  - ignore move, implement copy from media library

    return function(dispatch, getState) {

        let playlistItem = null;

        if (type === "image") {
            playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);
        }
        else if (type == "html5") {
            playlistItem = new HTML5PlaylistItem(
                stateName, //name,
                path, //htmlSiteName,
                true, //enableExternalData,
                true, //enableMouseEvents,
                true, //displayCursor,
                true, //hwzOn,
                false, //useUserStylesheet,
                null //userStyleSheet
            );
        }

        const mediaState = new MediaState (playlistItem, 0, 0);
        const newMediaStateId = mediaState.getId();

        let state = getState();

        // get number of media states before adding new media state
        const mediaStatesById = state.mediaStates.mediaStatesById;
        const numberOfMediaStates = Object.keys(mediaStatesById).length;

        // add mediaState to store
        dispatch(newMediaState(mediaState));
        // dispatch(addMediaStateToZonePlaylist(selectedZonePlaylist.id, mediaState));
        if (numberOfMediaStates === 0 || destinationIndex === 0) {
            dispatch(setInitialMediaState(selectedZonePlaylist.id, mediaState.getId()));
        }

        // if this is the first media state, then no transitions are required
        // else
        //      if this is an insertion to the beginning of the list
        //          create one transition
        //          source is created media state
        //          destination is the current first media state (initialMediaState)
        //      else if this is appending to the end of the playlist
        //          create one transition
        //          source is last media state in the playlist
        //          destination is the created media state
        //      else
        //          create two transitions
        //          transition 1
        //              source is media state at destination index
        //              destination is created media state
        //          transition 2
        //              source is media created media state
        //              destination is media state at destination index
        //  endif

        // destinationIndex is the index of where the dropped item should appear in the existing 'array' of items
        // (destinationIndex refers to the index prior to adding the new item)
        // destinationIndex === -1 => append it to the list
        if (numberOfMediaStates > 0) {

            if (destinationIndex < 0 || destinationIndex >= numberOfMediaStates) {

                //  append to the end of the playlist
                //      create one transition
                //      source is last media state in the playlist
                //      destination is the created media state

                destinationIndex = numberOfMediaStates;
                const sourceMediaState = getMediaStateAt(state, selectedZonePlaylist, destinationIndex - 1);
                const targetMediaState = mediaState;

                const userEvent = new UserEvent("timeout");
                userEvent.setValue("5");

                const transition = new Transition(sourceMediaState, userEvent, targetMediaState);
                dispatch(addTransition(sourceMediaState, transition, targetMediaState));
            }

            else if (destinationIndex === 0) {

                //  insertion at the beginning of the list
                //      create one transition
                //      source is created media state
                //      destination is the current first media state (initialMediaState)
                const sourceMediaState = mediaState;
                const targetMediaState = getMediaStateAt(state, selectedZonePlaylist, 0);

                const userEvent = new UserEvent("timeout");
                userEvent.setValue("5");

                const transition = new Transition(sourceMediaState, userEvent, targetMediaState);
                dispatch(addTransition(sourceMediaState, transition, targetMediaState));
            }

            else {

                //  first, delete the existing transition
                //  then, create two transitions
                //  transition 1
                //      source is media state at destination index - 1
                //      destination is created media state
                //  transition 2
                //      source is media created media state
                //      destination is media state at destination index

                let existingSourceMediaState = getMediaStateAt(state, selectedZonePlaylist, destinationIndex - 1);
                let existingSourceMediaStateId = existingSourceMediaState.getId();
                let existingTransitionOutId = existingSourceMediaState.transitionOutIds[0];

                let existingTargetMediaState = getMediaStateAt(state, selectedZonePlaylist, destinationIndex);
                let existingTargetMediaStateId = existingTargetMediaState.getId();
                let existingTransitionInId = existingTargetMediaState.transitionInIds[0];

                // remove transitions (from media states) between two states where new media state is getting inserted
                // then remove actual transition
                dispatch(deleteTransitionOut(existingSourceMediaState, existingTransitionOutId));
                dispatch(deleteTransitionIn(existingTargetMediaState, existingTransitionInId));
                dispatch(deleteTransition(existingTransitionOutId));

                state = getState();
                
                // next, create new transition and add it to the three media states
                const userEvent = new UserEvent("timeout");

                let sourceMediaState = getMediaState(state, existingSourceMediaStateId);
                let targetMediaState = getMediaState(state, existingTargetMediaStateId);
                let newMediaState = getMediaState(state, newMediaStateId);

                const transition0 = new Transition(sourceMediaState, userEvent, newMediaState);
                dispatch(addTransition(sourceMediaState, transition0, newMediaState));

                const transition1 = new Transition(newMediaState, userEvent, targetMediaState);
                dispatch(addTransition(newMediaState, transition1, targetMediaState));
            }
        }
    };

}