/**
 * Created by tedshaffer on 6/10/16.
 */
// import { CREATE_DEFAULT_SIGN, OPEN_SIGN, UPDATE_SIGN, ADD_HTML_SITE } from '../actions/index';
import { NEW_SIGN, ADD_ZONE } from '../actions/index';

export default function(state = {}, action) {

    console.log("reducer_sign:: action.type=" + action.type);

    let newState = null;

    switch (action.type) {
        case NEW_SIGN:
            // return action.payload;
            // initialize other sign parameters here?
            // return Object.assign({}, {
            //     name: action.payload,
            //     zoneIds: []
            // });
            newState = Object.assign({}, {
                id: action.payload.id,
                name: action.payload.name,
                zoneIds: []
            });
            return newState;
        case ADD_ZONE:
            const zoneId = action.payload;

            // newState = state.zoneIds.concat(zoneId);

            const newZoneIds = state.zoneIds.concat(zoneId);
            newState = Object.assign({}, state,
                { zoneIds: newZoneIds } );
            // newState = Object.assign({}, state, {
            //     zoneIds: [
            //         ...state.zoneIds, { zoneId }
            //     ]
            // });
            return newState;
            // return Object.assign({}, state, {
            //     todos: [
            //         ...state.todos,
            //         {
            //             text: action.text,
            //             completed: false
            //         }
            //     ]
            // })
        // case CREATE_DEFAULT_SIGN:
        //     console.log("reducer_sign:CREATE_DEFAULT_SIGN");
        //     return action.payload.sign;
        // case OPEN_SIGN:
        //     console.log("reducer_sign:OPEN_SIGN");
        //     return action.payload;
        // case UPDATE_SIGN:
        //     console.log("reducer_sign:UPDATE_SIGN");
        //     return action.payload;
        // case ADD_HTML_SITE:
        //     console.log("reducer_sign:ADD_HTML_SITE");
        //     let newSign = Object.assign({}, state);
        //     newSign.htmlSites.push(action.payload);
        //     return newSign;
    }

    return state;
}