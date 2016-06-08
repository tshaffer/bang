/**
 * Created by tedshaffer on 6/5/16.
 */

import { GET_MEDIA_FOLDER } from '../actions/index';
import { RECEIVE_MEDIA_FOLDER } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case RECEIVE_MEDIA_FOLDER:
            return action.payload;
    }

    return state;
}