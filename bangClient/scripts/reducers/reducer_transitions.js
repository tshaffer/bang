/**
 * Created by tedshaffer on 8/1/16.
 */
import { NEW_TRANSITION } from '../actions/index';

const initialState =
{
    transitionsById: {}
};

let newState;

export default function(state = initialState, action) {

    switch (action.type) {
        
        case NEW_TRANSITION:

            const transition = action.transition;

            let newTransitionsById = Object.assign({}, state.transitionsById);
            newTransitionsById[transition.getId()] = transition;

            newState = {
                transitionsById: newTransitionsById
            };
            return newState;
    }
    
    return state;
};
