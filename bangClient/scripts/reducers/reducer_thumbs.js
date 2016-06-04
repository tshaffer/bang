/**
 * Created by tedshaffer on 6/4/16.
 */

import { GET_THUMBS } from '../actions/index';

export default function(state = [], action) {
    console.log("reducer_thumbs invoked");

    switch (action.type) {
        case GET_THUMBS:
            return action.payload.data.thumbs;
    }

    return state;
}