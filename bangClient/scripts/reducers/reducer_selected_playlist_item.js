/**
 * Created by tedshaffer on 6/19/16.
 */
import { SET_SELECTED_PLAYLIST_ITEM } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case SET_SELECTED_PLAYLIST_ITEM:
            return action.payload;
    }

    return state;
}