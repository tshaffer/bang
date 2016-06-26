/**
 * Created by tedshaffer on 6/19/16.
 */
import { SET_SELECTED_ZONE } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_SELECTED_ZONE:
            return action.payload;
    }

    return state;
}