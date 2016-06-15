/**
 * Created by tedshaffer on 6/15/16.
 */
import { SET_MEDIA_FOLDER_FILES } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_MEDIA_FOLDER_FILES:
            return action.payload;
    }

    return state;
}