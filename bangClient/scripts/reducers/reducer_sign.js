/**
 * Created by tedshaffer on 6/10/16.
 */
import { CREATE_DEFAULT_SIGN, OPEN_SIGN, UPDATE_SIGN, ADD_HTML_SITE } from '../actions/index';

export default function(state = [], action) {

    console.log("reducer_sign:: action.type=" + action.type);

    switch (action.type) {
        case CREATE_DEFAULT_SIGN:
            console.log("reducer_sign:CREATE_DEFAULT_SIGN");
            return action.payload.sign;
        case OPEN_SIGN:
            console.log("reducer_sign:OPEN_SIGN");
            return action.payload;
        case UPDATE_SIGN:
            console.log("reducer_sign:UPDATE_SIGN");
            return action.payload;
        case ADD_HTML_SITE:
            console.log("reducer_sign:ADD_HTML_SITE");
            let newSign = Object.assign({}, state);
            newSign.htmlSites.push(action.payload);
            return newSign;
    }

    return state;
}