/**
 * Created by tedshaffer on 6/9/16.
 */

import { SET_MEDIA_LIBRARY_FILES } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_MEDIA_LIBRARY_FILES:
            return action.payload.mediaItemThumbs;
    }

    return state;
}