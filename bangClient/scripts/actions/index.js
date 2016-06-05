/**
 * Created by tedshaffer on 6/3/16.
 */
import axios from 'axios';

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

