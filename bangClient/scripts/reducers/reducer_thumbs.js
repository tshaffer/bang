/**
 * Created by tedshaffer on 6/4/16.
 */

import { GET_THUMBS } from '../actions/index';
import { RECEIVE_THUMBS } from '../actions/index';

export default function(state = [], action) {
    console.log("reducer_thumbs invoked");

    switch (action.type) {
        case GET_THUMBS:
            return action.payload.data.thumbs;
        case RECEIVE_THUMBS:
            console.log("reducer_thumb invoked with RECEIVE_THUMBS");
            return action.payload;
    }

    return state;
}