/**
 * Created by tedshaffer on 6/5/16.
 */

import { GET_MEDIA_FOLDER } from '../actions/index';
import { RECEIVE_MEDIA_FOLDER } from '../actions/index';

export default function(state = [], action) {
    console.log("reducer_media_folder invoked");

    switch (action.type) {
        case GET_MEDIA_FOLDER:
            return action.payload.data.mediaFolder;
        case RECEIVE_MEDIA_FOLDER:
            console.log("reducer_media_folder invoked with RECEIVE_MEDIA_FOLDER: " + action.payload);
            return action.payload;
    }

    return state;
}