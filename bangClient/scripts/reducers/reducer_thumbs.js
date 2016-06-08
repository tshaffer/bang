/**
 * Created by tedshaffer on 6/4/16.
 */

import { RECEIVE_THUMBS } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case RECEIVE_THUMBS:
            return action.payload;
    }

    return state;
}