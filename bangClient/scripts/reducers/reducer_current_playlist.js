/**
 * Created by tedshaffer on 6/10/16.
 */
import { CREATE_DEFAULT_SIGN } from '../actions/index';
import { SET_CURRENT_PLAYLIST } from '../actions/index';
import { ADD_PLAYLIST_ITEM } from '../actions/index';

export default function(state = [], action) {

    switch (action.type) {
        case CREATE_DEFAULT_SIGN:
            return action.payload.currentPlaylist;
        case SET_CURRENT_PLAYLIST:
            return action.payload;
        case ADD_PLAYLIST_ITEM:
            return Object.assign({}, action.payload);
    }

    return state;
}
