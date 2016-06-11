/**
 * Created by tedshaffer on 6/10/16.
 */
import { CREATE_DEFAULT_SIGN } from '../actions/index';

export default function(state = [], action) {

    console.log("reducer_sign:: action.type=" + action.type);

    switch (action.type) {
        case CREATE_DEFAULT_SIGN:
            return action.payload.sign;
    }

    return state;
}