/**
 * Created by tedshaffer on 10/28/16.
 */

import { SELECT_MEDIA_STATE, DESELECT_MEDIA_STATE, DESELECT_ALL_MEDIA_STATES, SELECT_MEDIA_STATE_RANGE } from '../actions/index';

const initialState =
    {
        selectedMediaStateIds: [],
        lastSelectedMediaStateId: ""
    };

export default function(state = initialState, action) {

    switch (action.type) {
        case SELECT_MEDIA_STATE: {
            const newSelectedMediaStateIds = state.selectedMediaStateIds.concat([action.payload]);
            const newState =
                {
                    selectedMediaStateIds: newSelectedMediaStateIds,
                    lastSelectedMediaStateId: action.payload
                };
            return newState;
        }
        case DESELECT_MEDIA_STATE: {
            const newSelectedMediaStateIds = state.selectedMediaStateIds.filter( (value) => {
                return value != action.payload;
            });
            const newState =
                {
                    selectedMediaStateIds: newSelectedMediaStateIds,
                    lastSelectedMediaStateId: ""
                };
            return newState;
        }
        case DESELECT_ALL_MEDIA_STATES: {
            return initialState;
        }
        case SELECT_MEDIA_STATE_RANGE: {
            return null;
        }
    }

    return state;
}

// Selectors
export const isMediaStateSelected = (state, mediaStateId) => {
    // return true if mediaStateId is in state.selectedMediaStateIds; false otherwise
    const index = state.selectedMediaStates.selectedMediaStateIds.indexOf(mediaStateId);
    return (index >= 0);
};

export const isLastSelectedMediaState = (state, mediaStateId) => {
    // return true if mediaStateId == lastSelectedMediaStateId; false otherwise
    return mediaStateId == state.selectedMediaStates.lastSelectedMediaStateId;
};
