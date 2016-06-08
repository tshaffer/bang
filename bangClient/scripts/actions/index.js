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

export function fetchMediaFolder() {
    console.log("fetchMediaFolder invoked");
    return function (dispatch) {

        console.log("fetchMediaFolder perform fetch");

        return fetch(`http://localhost:6969/getMediaFolder`)
            .then(response => response.json())
            .then(function(data) {
                const mediaFolder = data.mediaFolder;
                dispatch(receiveMediaFolder(mediaFolder));
            });
    }

};


import axios from 'axios';

export const GET_MEDIA_FOLDER = 'GET_MEDIA_FOLDER';
export const GET_THUMBS = 'GET_THUMBS';

export function getMediaFolder() {

    console.log("getMediaFolder invoked");
    //
    // const url = "http://localhost:6969/";
    //
    // const getMediaFolderUrl = url + "getMediaFolder";
    //
    // $.get( getMediaFolderUrl, function( mediaFolder ) {
    //     console.log("getMediaFolder jquery call returned: " + mediaFolder);
    // });
    //
    // const request = axios.get(getMediaFolderUrl, {});
    //
    // return {
    //     type: GET_MEDIA_FOLDER,
    //     payload: request
    // };
}


export function getThumbs(mediaFolder) {
    
    console.log("getThumbs invoked");

    const url = "http://localhost:6969/";
    
    const updateMediaFolderUrl = url + "updateMediaFolder";
    const updateMediaFolderRequest = axios.get(updateMediaFolderUrl, {
        params: { mediaFolder: mediaFolder }
    });

    // test code
    // updateMediaFolderRequest.then(function(data) {
    //     const getThumbsUrl = url + "getThumbs";
    //     const request = axios.get(getThumbsUrl, {
    //         params: { mediaFolder: mediaFolder }
    //     });
    //
    //     return {
    //         type: GET_THUMBS,
    //         payload: request
    //     };
    //
    // });

    const getThumbsUrl = url + "getThumbs";
    const request = axios.get(getThumbsUrl, {
        params: { mediaFolder: mediaFolder }
    });

    return {
        type: GET_THUMBS,
        payload: request
    };
}

