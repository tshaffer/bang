/**
 * Created by tedshaffer on 6/3/16.
 */

import axios from 'axios';
import fetch from 'isomorphic-fetch';

export const RECEIVE_MEDIA_FOLDER = 'RECEIVE_MEDIA_FOLDER'
export function receiveMediaFolder(mediaFolder) {
    return {
        type: RECEIVE_MEDIA_FOLDER,
        payload: mediaFolder
    }
}

export const RECEIVE_THUMBS = 'RECEIVE_THUMBS'
export function receiveThumbs(thumbs) {
    return {
        type: RECEIVE_THUMBS,
        payload: thumbs
    }
}

export const SET_MEDIA_FOLDER = 'SET_MEDIA_FOLDER';
export function setMediaFolder(mediaFolder) {

    return function(dispatch) {


        const updateMediaFolderUrl = "http://localhost:6969/" + "updateMediaFolder";
        axios.get(updateMediaFolderUrl, {
            params: { mediaFolder: mediaFolder }
        }).then(function() {

            dispatch(receiveMediaFolder(mediaFolder));

            const getThumbsUrl = "http://localhost:6969/" + "getThumbs";

            return axios.get(getThumbsUrl, {
                params: {mediaFolder: mediaFolder}
            }).then(function (data) {
                dispatch(receiveThumbs(data.data.thumbs));
            });
        })
    }
}


export function fetchMediaFolder() {

    return function (dispatch) {

        fetch(`http://localhost:6969/getMediaFolder`)
            .then(response => response.json())
            .then(function(data) {

                const mediaFolder = data.mediaFolder;

                dispatch(receiveMediaFolder(mediaFolder));

                const getThumbsUrl = "http://localhost:6969/" + "getThumbs";

                return axios.get(getThumbsUrl, {
                    params: { mediaFolder: mediaFolder }
                }).then(function(data) {
                    dispatch(receiveThumbs(data.data.thumbs));
                });
            });
    }
};
