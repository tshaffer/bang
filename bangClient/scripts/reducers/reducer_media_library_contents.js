/**
 * Created by tedshaffer on 6/3/16.
 */

import { SET_MEDIA_LIBRARY_CONTENTS } from '../actions/index';

export default function(state = null, action) {
    console.log("reducer_media_library_contents invoked");
    switch (action.type) {
        case SET_MEDIA_LIBRARY_CONTENTS:
            return action.payload;
    }

    return state;
}