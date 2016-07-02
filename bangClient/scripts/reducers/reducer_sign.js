/**
 * Created by tedshaffer on 6/10/16.
 */
// import { CREATE_DEFAULT_SIGN, OPEN_SIGN, UPDATE_SIGN, ADD_HTML_SITE } from '../actions/index';
import { NEW_SIGN, ADD_ZONE, ADD_HTML_SITE } from '../actions/index';
import { guid } from '../utilities/utils';

import Norm_Sign from '../normalizedBADM/norm_sign';

const emptySign = new Norm_Sign();

const initialState = emptySign;
// const initialState =
// {
//     id: "",
//     name: "",
//     zoneIds: [],
//     htmlSiteIds: []
// };

export default function(state = initialState, action) {

    console.log("reducer_sign:: action.type=" + action.type);

    let newState = null;

    switch (action.type) {
        case NEW_SIGN:
            return action.payload;
        case ADD_ZONE:
            const normZone = action.payload;
            const id = normZone.id;

            const newItem = {};
            newItem[id] = normZone;
            const newZonesById = Object.assign({}, state.zonesById, newItem);

            newState = Object.assign(emptySign, state,
                { zonesById: newZonesById } );
            return newState;

        // case CREATE_DEFAULT_SIGN:
        //     console.log("reducer_sign:CREATE_DEFAULT_SIGN");
        //     return action.payload.sign;
        // case OPEN_SIGN:
        //     console.log("reducer_sign:OPEN_SIGN");
        //     return action.payload;
        // case UPDATE_SIGN:
        //     console.log("reducer_sign:UPDATE_SIGN");
        //     return action.payload;
        case ADD_HTML_SITE:
            const htmlSiteId = action.payload;

            const newHtmlSiteIds = state.htmlSiteIds.concat(htmlSiteId);
            newState = Object.assign({}, state,
                { htmlSiteIds: newHtmlSiteIds } );
            return newState;
    }

    return state;
}