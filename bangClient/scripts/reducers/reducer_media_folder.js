/**
 * Created by tedshaffer on 6/5/16.
 */

import { SET_MEDIA_FOLDER } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_MEDIA_FOLDER:
            return action.payload;
    }

    return state;
}