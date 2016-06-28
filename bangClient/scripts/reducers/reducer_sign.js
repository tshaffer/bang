/**
 * Created by tedshaffer on 6/10/16.
 */
// import { CREATE_DEFAULT_SIGN, OPEN_SIGN, UPDATE_SIGN, ADD_HTML_SITE } from '../actions/index';
import { NEW_SIGN, ADD_ZONE, ADD_HTML_SITE } from '../actions/index';
import { guid } from '../utilities/utils';

const initialState =
{
    id: "",
    name: "",
    zoneIds: [],
    htmlSiteIds: []
};

export default function(state = initialState, action) {

    console.log("reducer_sign:: action.type=" + action.type);

    let newState = null;

    switch (action.type) {
        case NEW_SIGN:
            newState = Object.assign({}, {
                id: guid(),
                name: action.payload.name,
                zoneIds: []
            });
            return newState;
        case ADD_ZONE:
            const zoneId = action.payload;

            const newZoneIds = state.zoneIds.concat(zoneId);
            newState = Object.assign({}, state,
                { zoneIds: newZoneIds } );
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