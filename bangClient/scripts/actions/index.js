/**
 * Created by tedshaffer on 6/3/16.
 */
// import { newSign, newZone, addMediaState, addContentItem, addTransition, deleteTransition, addEvent } from 'bangDM/dist/actions/index';
// import Event from 'bangDM/dist/entities/event';
// import Transition from 'bangDM/dist/entities/transition';
// import MediaState from 'bangDM/dist/entities/mediaState';
// import ContentItem from 'bangDM/dist/entities/contentItem';
//
// import { getMediaStates } from 'bangDM/dist/reducers/reducerZone';

import {
    DmState, DmDispatch, DmSign,
    VideoMode, VideoModeName, ZoneType,
    baNewSign, baAddZone,
    baGetSignMetaData, baGetZoneCount, baGetZoneByName
} from '@brightsign/badatamodel';

import ImageMediaItem from '../entities/imageMediaItem';

import { executeLoadAppData, executeSelectMediaFolder, getFileName } from '../platform/actions';

export function loadAppData() {
    return executeLoadAppData();
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

export function createDefaultPresentation(presentationName) {

    let store = null;

    return function (dispatch, getState) {

        dispatch(baNewSign("New Sign", "v1920x1080x60p"));

        store = getState().baDmReducer;

        let zoneCount = baGetZoneCount(store);
        let newZoneName = "Zone" + (zoneCount+1).toString();
        dispatch(baAddZone(newZoneName,2));

        zoneCount = baGetZoneCount(getState().baDmReducer);
        console.log("number of zones is:", zoneCount);

        let zone = baGetZoneByName(getState().baDmReducer, {name: newZoneName});
        if (zone) {
            console.log("Found new zone: ", zone.name);
        } else {
            console.log("Could not add and find zone!");
        }
    };
}

// use selector instead
function getMediaState(state, mediaStateId) {
    return state.mediaStates.mediaStatesById[mediaStateId];
}

export function addMediaStateToNonInteractivePlaylist(stateName, path) {

    // TERRIBLE HACKS IN HERE
    return function(dispatch, getState) {

        let store = null;

        store = getState().bangReducer;

        // const allMediaStatesBefore = getMediaStates(store);
        const allMediaStatesByIdBefore = store.mediaStates.mediaStatesById;

        // how to get zone?
        // the following is a hack way to do it
        // const zones = store.zones;

        // take first entry
        const zoneId = store.sign.zoneIds[0];
        // const currentZone = getZoneById(store, {id: zoneId});

        // const contentItem = new ContentItem(stateName, "media", path);
        // const mediaState = new MediaState(stateName, contentItem.id);
        // dispatch(addContentItem(contentItem));
        // const msAction = dispatch(addMediaState(stateName, mediaState, zoneId));

        // need to deal with transitions
        // since we're appending media states, the algorithm should be as follows
        //  get media states from selector before doing anything.
        //  after adding media state, get media states again. if count is 1, do nothing. if count is more, do something.

        // store = getState().bangReducer;
        // const allMediaStatesByIdAfter = store.mediaStates.mediaStatesById;
        // const allMediaStatesByIdAfterCount = Object.keys(allMediaStatesByIdAfter).length;

        // if (allMediaStatesByIdAfterCount > 1) {
        //
        //     const indexOfLastMediaState = allMediaStatesBefore.length - 1;
        //
        //     let sourceMediaState = allMediaStatesBefore[indexOfLastMediaState];         // should work
        //
        //     // delete existing transition if one exists
        //     if (allMediaStatesByIdAfterCount > 2) {
        //         if (sourceMediaState.transitionOutIds.length > 0) {
        //             let transitionId = sourceMediaState.transitionOutIds[0];                      // should work
        //             dispatch(deleteTransition(transitionId));                               // should work
        //         }
        //     }
        //
        //     // create new transition from last media state to this media state
        //     // let destinationMediaState = allMediaStatesAfter[indexOfNewMediaState];      // won't work
        //     let destinationMediaState = mediaState;
        //     let timeoutEvent = new Event("timeout", "timeout", 5);                      // should work
        //     dispatch(addEvent(timeoutEvent));
        //     let transition = new Transition("mPriorToNew", sourceMediaState.id, timeoutEvent.id, destinationMediaState.id);
        //
        //     // transition
        //     dispatch(addTransition(sourceMediaState, transition, destinationMediaState));
        //
        //     // add transition from indexOfNewMediaState to media state at index = 0
        //     sourceMediaState = destinationMediaState;
        //     destinationMediaState = allMediaStatesBefore[0];
        //     timeoutEvent = new Event("timeout", "timeout", 5);
        //     dispatch(addEvent(timeoutEvent));
        //     transition = new Transition("mLastTo0", sourceMediaState.id, timeoutEvent.id, destinationMediaState.id);
        //     dispatch(addTransition(sourceMediaState, transition, destinationMediaState));
        //
        //     store = getState().bangReducer;
        // }
    };
}
