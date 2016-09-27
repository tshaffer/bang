import { SET_FIRMWARE_SPECS } from '../actions/fwActions';

const initialState =
    {
        firmwareSpecsByFamily: {}
    };

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {
        case SET_FIRMWARE_SPECS:
            newState = {
                firmwareSpecsByFamily: action.firmwareSpecsByFamily
            };
            return newState;
    }

    return state;
}
