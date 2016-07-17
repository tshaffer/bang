/**
 * Created by tedshaffer on 7/17/16.
 */
import { CLEAR_MEDIA_STATES, NEW_MEDIA_STATE, UPDATE_MEDIA_STATE, DELETE_MEDIA_STATE } from '../actions/index';

const initialState =
{
    mediaStatesById: {}
};

export default function(state = initialState, action) {

    // console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let mediaState;

    let newMediaStatesById;
    let mediaStateId = "";

    switch (action.type) {
        case CLEAR_MEDIA_STATES:
            return initialState;

        case NEW_MEDIA_STATE:
            mediaState = action.payload;
            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            newMediaStatesById[mediaState.getId()] = mediaState;

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;
        
        case UPDATE_MEDIA_STATE:
        case DELETE_MEDIA_STATE:
            break;
    }

    return state;
};
