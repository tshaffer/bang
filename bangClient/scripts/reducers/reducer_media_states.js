/**
 * Created by tedshaffer on 7/17/16.
 */
import { CLEAR_MEDIA_STATES, NEW_MEDIA_STATE, MOVE_MEDIA_STATE, UPDATE_MEDIA_STATE,
    DELETE_MEDIA_STATE,
    ADD_TRANSITION_OUT, ADD_TRANSITION_IN, DELETE_TRANSITION_OUT
    } from '../actions/index';

import MediaState from '../badm/mediaState';

const initialState =
{
    mediaStatesById: {}
};

export default function(state = initialState, action) {

    // console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let newMediaState = null;
    let mediaState;
    let emptyMediaState = null;

    let newMediaStatesById;
    let mediaStateId = "";

    let transitionId = "";

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

            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            delete newMediaStatesById[mediaStateId];

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

        // case ADD_TRANSITION:
        //
        //     let sourceMediaStateId = action.sourceMediaStateId;
        //     let destinationMediaStateId = action.destinationMediaStateId;
        //
        //     let updatedMediaState = Object.assign()
        //     break;

        case ADD_TRANSITION_OUT:

            const sourceMediaState = action.sourceMediaState;
            transitionId = action.transitionId;

            emptyMediaState = new MediaState(null, -1, -1);
            newMediaState = Object.assign(emptyMediaState, sourceMediaState);
            newMediaState.transitionOutIds.push(transitionId);

            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            newMediaStatesById[newMediaState.getId()] = newMediaState;

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

        case ADD_TRANSITION_IN:
            
            const targetMediaState = action.targetMediaState;
            transitionId = action.transitionId;

            emptyMediaState = new MediaState(null, -1, -1);
            newMediaState = Object.assign(emptyMediaState, targetMediaState);
            newMediaState.transitionInIds.push(transitionId);

            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            newMediaStatesById[newMediaState.getId()] = newMediaState;

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

        case DELETE_TRANSITION_OUT:

            mediaState = action.mediaState;
            transitionId = action.transitionId;

            emptyMediaState = new MediaState(null, -1, -1);
            newMediaState = Object.assign(emptyMediaState, mediaState);
            newMediaState.transitionOutIds = newMediaState.transitionOutIds.filter(function(ele) { return ele != transitionId; });

            newMediaStatesById = Object.assign({}, state.mediaStatesById);
            newMediaStatesById[newMediaState.getId()] = newMediaState;

            newState = {
                mediaStatesById: newMediaStatesById
            };
            return newState;

    }

    return state;
};
