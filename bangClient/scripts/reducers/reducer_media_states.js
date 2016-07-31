/**
 * Created by tedshaffer on 7/17/16.
 */
import { CLEAR_MEDIA_STATES, NEW_MEDIA_STATE, MOVE_MEDIA_STATE, UPDATE_MEDIA_STATE,
    ADD_TRANSITION, DELETE_MEDIA_STATE } from '../actions/index';

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

            mediaStateId = action.mediaStateId;
            mediaState = action.mediaState;

            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            newMediaStatesById[mediaStateId] = mediaState;

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

        case DELETE_MEDIA_STATE:

            mediaStateId = action.mediaStateId;

            // this works for an array, not an object
            // newMediaStatesById = state.mediaStatesById.filter(function(ele) { return ele != mediaStateId; });
            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            delete newMediaStatesById[mediaStateId];

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

        case ADD_TRANSITION:

            let sourceMediaStateId = action.sourceMediaStateId;
            let destinationMediaStateId = action.destinationMediaStateId;

            let updatedMediaState = Object.assign()
            break;

        case DELETE_MEDIA_STATE:
            break;
    }

    return state;
};
