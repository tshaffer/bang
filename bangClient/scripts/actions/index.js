import { baNewSign, baAddZone, baGetZonesForSign, baGetZoneCount, baGetZoneByName, baAddMediaState } from '@brightsign/badatamodel';
import { BaDmIdNone, ZoneType, ContentItemType, MediaStateContainerType, MediaType } from '@brightsign/badatamodel';
import { VideoMode } from '@brightsign/badatamodel';

import { MediaObject } from '@brightsign/badatamodel';

import { executeLoadAppData, executeSelectMediaFolder, getFileName } from '../platform/actions';


export function loadAppData() {
    return executeLoadAppData();
}


export const ADD_MEDIA_OBJECTS = 'ADD_MEDIA_OBJECTS';
export function addMediaObjects(mediaLibraryFiles) {

    let mediaObjects = [];

    mediaLibraryFiles.forEach(function(mediaFolderFile) {

        const dmMediaObjectState = { path: mediaFolderFile.filePath, mediaType: MediaType.Image };
        let mediaObject = new MediaObject(dmMediaObjectState);

        // HACK - should fileName get added to DmMediaObjectState
        mediaObject.fileName = getFileName(mediaFolderFile.filePath);
        mediaObjects.push(mediaObject);
    });

    return {
        type: ADD_MEDIA_OBJECTS,
        payload: mediaObjects
    };
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


// Playlist / presentation functionality
export function createDefaultPresentation(presentationName) {

    return function (dispatch, getState) {

        dispatch(baNewSign("New Sign", VideoMode.v1920x1080x60p));

        let reduxState = getState();
        let badm = reduxState.badm;

        let zoneCount = baGetZoneCount(badm);
        let newZoneName = "Zone" + (zoneCount+1).toString();
        dispatch(baAddZone(newZoneName,ZoneType.Video_Or_Images));

        reduxState = getState();
        badm = reduxState.badm;

        zoneCount = baGetZoneCount(badm);
        console.log("number of zones is:", zoneCount);

        let zone = baGetZoneByName(badm, {name: newZoneName});
        if (zone) {
            console.log("Found new zone: ", zone.name);
        } else {
            console.log("Could not add and find zone!");
        }
    };
}


export function addMediaStateToNonInteractivePlaylist(stateName, path) {

    let reduxState = null;
    let badm = null;

    return function(dispatch, getState) {

        reduxState = getState();
        badm = reduxState.badm;

        // this code assumes single zone
        const zoneCount = baGetZoneCount(badm);
        // assert zoneCount === 1
        const zoneIds = baGetZonesForSign(badm);
        // assert zoneIds.length === 1
        const zoneId = zoneIds[0];

        const mediaObject = {path: path, mediaType: MediaType.Image};
        const contentItem = {id: BaDmIdNone, name: stateName, type: ContentItemType.Media, media: mediaObject};
        const zoneContainer = {id: zoneId, type: MediaStateContainerType.Zone};
        const msAction = dispatch(baAddMediaState(stateName, zoneContainer, contentItem));
        const mediaStateId = msAction.id;

        reduxState = getState();
        badm = reduxState.badm;

        return;

        // store = getState().bangReducer;
        //
        // // const allMediaStatesBefore = getMediaStates(store);
        // const allMediaStatesByIdBefore = store.mediaStates.mediaStatesById;
        //
        // // how to get zone?
        // // the following is a hack way to do it
        // // const zones = store.zones;
        //
        // // take first entry
        // zoneId = store.sign.zoneIds[0];
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

// use selector instead
// function getMediaState(state, mediaStateId) {
//     return state.mediaStates.mediaStatesById[mediaStateId];
// }

