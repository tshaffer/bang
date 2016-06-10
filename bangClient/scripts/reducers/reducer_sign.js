/**
 * Created by tedshaffer on 6/10/16.
 */
import { CREATE_DEFAULT_SIGN } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case CREATE_DEFAULT_SIGN:
            return action.payload;
    }

    return state;
}