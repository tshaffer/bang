/**
 * Created by tedshaffer on 6/3/16.
 */

import fetch from 'isomorphic-fetch'

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


import axios from 'axios';

export const GET_MEDIA_FOLDER = 'GET_MEDIA_FOLDER';
export const GET_THUMBS = 'GET_THUMBS';

export function getThumbs(mediaFolder) {
    
    console.log("getThumbs invoked");

    const url = "http://localhost:6969/";
    
    const updateMediaFolderUrl = url + "updateMediaFolder";
    const updateMediaFolderRequest = axios.get(updateMediaFolderUrl, {
        params: { mediaFolder: mediaFolder }
    });

    const getThumbsUrl = url + "getThumbs";
    const request = axios.get(getThumbsUrl, {
        params: { mediaFolder: mediaFolder }
    });

    return {
        type: GET_THUMBS,
        payload: request
    };
}

