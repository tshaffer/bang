import { SET_BSN_AUTH_DATA } from '../actions/bsnActions';

const initialState = {};

export default function(state = initialState, action) {

    switch (action.type) {
        case SET_BSN_AUTH_DATA:
            return action.payload;
    }

    return state;
}