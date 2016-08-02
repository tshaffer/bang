/**
 * Created by tedshaffer on 8/1/16.
 */
import { NEW_TRANSITION, DELETE_TRANSITION } from '../actions/index';

const initialState =
{
    transitionsById: {}
};

let newState;
let newTransitionsById = null;

export default function(state = initialState, action) {

    switch (action.type) {
        
        case NEW_TRANSITION:

            const transition = action.transition;

            newTransitionsById = Object.assign({}, state.transitionsById);
            newTransitionsById[transition.getId()] = transition;

            newState = {
                transitionsById: newTransitionsById
            };
            return newState;

        case DELETE_TRANSITION:

            const transitionId = action.transitionId;

            newTransitionsById = Object.assign({}, state.transitionsById);
            delete newTransitionsById[transitionId];

            newState = {
                transitionsById: newTransitionsById
            };
            return newState;

    }
    
    return state;
};
