/**
 * Created by tedshaffer on 6/3/16.
 */

import axios from 'axios';
import fetch from 'isomorphic-fetch';

import ImagePlaylistItem from '../badm';

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

    mediaLibraryFiles.forEach( mediaLibraryFile =>
    {
        const fileName = mediaLibraryFile.fileName;
        const id = mediaLibraryFile.id;
        const filePath = mediaLibraryFile.mediaFilePath;
        const mediaFolder = mediaLibraryFile.mediaFolder;
        const thumbUrl = mediaLibraryFile.thumbFileName;

        const imagePlaylistItem = new ImagePlaylistItem(fileName, filePath, thumbUrl, id);
        mediaLibraryPlaylistItems.push(imagePlaylistItem);
    });

    return {
        type: SET_MEDIA_LIBRARY_FILES,
        payload: mediaLibraryPlaylistItems
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
