/**
 * Created by tedshaffer on 6/9/16.
 */

import { SET_ALL_THUMBS, SET_MEDIA_LIBRARY_FILES } from '../actions/index';

export default function(state = {}, action) {

    switch (action.type) {
        case SET_MEDIA_LIBRARY_FILES:

            // let newMediaItemThumbs = action.payload.mediaItemThumbs;
            //
            // // merge existing thumbs with new thumbs - merging in this direction avoid mutating current state
            // for (var prop in state) {
            //     if (state.hasOwnProperty( prop ) &&  !newMediaItemThumbs.hasOwnProperty( prop )) {
            //         newMediaItemThumbs[prop] = state[prop];
            //     }
            // }
            //
            // return newMediaItemThumbs;
            return state;
        case SET_ALL_THUMBS:
            return action.payload;
    }

    return state;
}