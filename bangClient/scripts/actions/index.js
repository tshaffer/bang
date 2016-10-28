import { baNewSign, baAddZone, baGetZonesForSign, baGetZoneCount, baGetZoneByName, baAddMediaState } from '@brightsign/badatamodel';
import { baPlaylistAppendMediaState } from '@brightsign/badatamodel';

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


        // soon to be obsolete code
        const msAction = dispatch(baAddMediaState(stateName, zoneContainer, contentItem));
        const mediaStateId = msAction.id;

        // code using new badm functionality - doesn't work yet
        // export function baPlaylistAppendMediaState(
        //     name: string,
        //     container: DmMediaStateContainer,
        //     contentItemState: DmContentItemState,
        //     volume?,
        //     transitionType?: TransitionType,
        //     eventType?: EventType,
        //     eventData?: any
        // ) : BaDmThunkAction<PlaylistAddMediaStateAction>;
        // let thunkAction = dispatch(baPlaylistAppendMediaState (stateName, zoneContainer, contentItem));
        // thunkAction.then( (mediaStateAction) => {
        //     console.log("addMediaStateToNonInteractivePlaylist, return from dispatch");
        //
        //     reduxState = getState();
        //     badm = reduxState.badm;
        // });

        // reduxState = getState();
        // badm = reduxState.badm;
    };
}
