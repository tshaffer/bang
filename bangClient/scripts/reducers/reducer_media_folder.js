/**
 * Created by tedshaffer on 6/5/16.
 */

import { SET_MEDIA_FOLDER } from '../actions/index';

const initialState = "";

export default function(state = initialState, action) {

    switch (action.type) {
        case SET_MEDIA_FOLDER:
            return action.payload;
    }

    return state;
}