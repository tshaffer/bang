/**
 * Created by tedshaffer on 6/16/16.
 */
import { SET_DB } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_DB:
            return action.payload;
    }

    return state;
}