/**
 * Created by tedshaffer on 6/9/16.
 */

import { SET_MEDIA_THUMBS, MERGE_MEDIA_THUMBS } from '../actions/index';

export default function(state = {}, action) {

    switch (action.type) {
        case SET_MEDIA_THUMBS:
            return action.payload;
        case MERGE_MEDIA_THUMBS:
            let newMediaItemThumbs = action.payload;

            // merge existing thumbs with new thumbs - merging in this direction avoids mutating current state
            for (var prop in state) {
                if (state.hasOwnProperty( prop ) &&  !newMediaItemThumbs.hasOwnProperty( prop )) {
                    newMediaItemThumbs[prop] = state[prop];
                }
            }
            return newMediaItemThumbs;
    }

    return state;
}