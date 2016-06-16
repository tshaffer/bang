/**
 * Created by tedshaffer on 6/16/16.
 */
import { SET_THUMB_FILES } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_THUMB_FILES:
            return action.payload;
    }

    return state;
}