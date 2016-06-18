/**
 * Created by tedshaffer on 6/9/16.
 */

import { SET_ALL_THUMBS, MERGE_THUMBS } from '../actions/index';

export default function(state = {}, action) {

    switch (action.type) {
        case MERGE_THUMBS:
            let newMediaItemThumbs = action.payload;

            // merge existing thumbs with new thumbs - merging in this direction avoids mutating current state
            for (var prop in state) {
                if (state.hasOwnProperty( prop ) &&  !newMediaItemThumbs.hasOwnProperty( prop )) {
                    newMediaItemThumbs[prop] = state[prop];
                }
            }
            return newMediaItemThumbs;
        case SET_ALL_THUMBS:
            return action.payload;
    }

    return state;
}