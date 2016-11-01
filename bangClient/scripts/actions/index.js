import { baNewSign, baAddZone, baGetZonesForSign, baGetZoneCount, baGetZoneByName } from '@brightsign/badatamodel';
import { baPlaylistAddMediaState, baPlaylistAppendMediaState } from '@brightsign/badatamodel';

import { BaDmIdNone, ZoneType, ContentItemType, MediaStateContainerType, MediaType } from '@brightsign/badatamodel';
import { VideoMode } from '@brightsign/badatamodel';

import { MediaObject } from '@brightsign/badatamodel';

import { executeLoadAppData, executeSelectMediaFolder, getFileName } from '../platform/actions';


export const ADD_MEDIA_OBJECTS = 'ADD_MEDIA_OBJECTS';
export const SET_MEDIA_FOLDER = 'SET_MEDIA_FOLDER';
export const SET_MEDIA_THUMBS = 'SET_MEDIA_THUMBS';
export const MERGE_MEDIA_THUMBS = 'MERGE_MEDIA_THUMBS';

export const SELECT_MEDIA_STATE = 'SELECT_MEDIA_STATE';
// export const SELECT_MEDIA_STATE_RANGE = 'SELECT_MEDIA_STATE_RANGE';
export const DESELECT_MEDIA_STATE = 'DESELECT_MEDIA_STATE';
export const DESELECT_ALL_MEDIA_STATES= 'DESELECT_ALL_MEDIA_STATES';


export function selectMediaState(mediaStateId) {
    return {
        type: SELECT_MEDIA_STATE,
        payload: mediaStateId
    };
}

// export function selectMediaStateRange(mediaStateId) {
//     return {
//         type: SELECT_MEDIA_STATE_RANGE,
//         payload: mediaStateId
//     };
// }
//
export function deselectMediaState(mediaStateId) {
    return {
        type: DESELECT_MEDIA_STATE,
        payload: mediaStateId
    };
}

export function deselectAllMediaStates() {
    return {
        type: DESELECT_ALL_MEDIA_STATES
    };
}


export function loadAppData() {
    return executeLoadAppData();
}


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

export function setMediaFolder(mediaFolder) {
    return {
        type: SET_MEDIA_FOLDER,
        payload: mediaFolder
    };
}

export function setMediaThumbs(thumbsByPath) {

    return {
        type: SET_MEDIA_THUMBS,
        payload: thumbsByPath
    };
}

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


// not currently in use
export function appendMediaStateToNonInteractivePlaylist(stateName, path) {
    let reduxState = null;
    let badm = null;

    return function (dispatch, getState) {

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

        let thunkAction = dispatch(baPlaylistAppendMediaState(stateName, zoneContainer, contentItem));
        thunkAction.then((mediaStateAction) => {
            console.log("addMediaStateToNonInteractivePlaylist, return from dispatch");

            reduxState = getState();
            badm = reduxState.badm;
        });
    };
}

export function addMediaStateToNonInteractivePlaylist(index, stateName, path) {

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


        // * Add a new MediaState to the playlist at a given index.
        // * This function will fail if the MediaState container does not contain a valid simple playlist.
        // *
        // * @param index - zero based index at which to add new MediaState.
        // *   If out of range, MediaState will be appended to the end.
        // * @param name - Desired mediaState name
        // * @param container - MediaState container, interface: DmMediaStateContainer
        // * @param contentItemState - ContentItem, interface: DmDerivedContentItemState
        // * @param volume - optional, numeric volume in range (0..100) - only pertinent for media content. Default: 0
        // * @param transitionType - optional, type of Transition to next state. Type: TransitionType. Default: No_effect
        // * @param eventType - optional, type of event that triggers the transition. Type: EventType.
        // *   Default: MediaEnd for video/audio, Timer for images
        //                                                  * @param eventData - optional, data for event. For timer events, this be be a DmTimer object
        // * @returns BaDmThunkAction - thunk function. When dispatched, the thunk function will return a promise that will
        // *   resolve with a PlaylistAddMediaStateAction.
        // *   Success: The action properties returned will be the ones used, including substitutions made for optional input.
        // *   Failure: Action is returned with error property set to true, and reason property holding error description.
        // */
        // export function baPlaylistAddMediaState(
        //     index : number,
        //     name: string,
        //     container: DmMediaStateContainer,
        //     contentItemState: DmContentItemState,
        //     volume?,
        //     transitionType?: TransitionType,
        //     eventType?: EventType,
        //     eventData?: any
        // ) : BaDmThunkAction<PlaylistAddMediaStateAction>;



        let thunkAction = dispatch(baPlaylistAddMediaState (index, stateName, zoneContainer, contentItem));
        thunkAction.then( (mediaStateAction) => {
            console.log("addMediaStateToNonInteractivePlaylist, return from dispatch");

            reduxState = getState();
            badm = reduxState.badm;
        });
    };
}
