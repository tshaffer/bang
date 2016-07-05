/**
 * Created by tedshaffer on 6/10/16.
 */
// import { CREATE_DEFAULT_SIGN, OPEN_SIGN, UPDATE_SIGN, ADD_HTML_SITE } from '../actions/index';
import { NEW_SIGN, OPEN_SIGN, ADD_ZONE, UPDATE_SIGN } from '../actions/index';
import { guid } from '../utilities/utils';

import Norm_Sign from '../normalizedBADM/norm_sign';

const emptySign = new Norm_Sign();

const initialState = emptySign;

export default function(state = initialState, action) {

    // console.log("reducer_sign:: action.type=" + action.type);

    let newState = null;

    switch (action.type) {
        case NEW_SIGN:
            let newSign = new Norm_Sign(action.payload.name, action.payload.videoMode);
            return newSign;

        case OPEN_SIGN:
            let openedSign = new Norm_Sign(action.payload.name)
            openedSign.videoMode = action.payload.videoMode;
            return openedSign;            

        case ADD_ZONE:
            const id = action.payload;
            const newZoneIds = state.zoneIds.concat(id);

            newState = Object.assign(emptySign, state,
                { zoneIds: newZoneIds } );
            return newState;
        
        case UPDATE_SIGN:
            return action.payload;

        // case ADD_HTML_SITE:
        //     const htmlSiteId = action.payload;
        //
        //     const newHtmlSiteIds = state.htmlSiteIds.concat(htmlSiteId);
        //     newState = Object.assign({}, state,
        //         { htmlSiteIds: newHtmlSiteIds } );
        //     return newState;
    }

    return state;
}