/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE, SET_ZONE_PLAYLIST } from '../actions/index';

import Norm_Zone from '../normalizedBADM/norm_zone';

const initialState =
{
    zonesById: {}
};

export default function(state = initialState, action) {

    // console.log("reducer_zones:: action.type=" + action.type);

    let newZone = null;
    let newState = null;
    let newZonesById = null;

    switch (action.type) {
        case NEW_ZONE:

            newZone = new Norm_Zone(action.payload.name, action.payload.type);

            const newItem = {};
            newItem[newZone.id] = newZone;
            newZonesById = Object.assign({}, state.zonesById, newItem);

            newState = {
                zonesById: newZonesById,
            }
            return newState;

        case SET_ZONE_PLAYLIST:
            const zoneId = action.payload.zoneId;
            const zonePlaylistId = action.payload.zonePlaylistId;
        
            newZone = Object.assign({}, state.zonesById[zoneId], {zonePlaylistId: zonePlaylistId});
        
            // update zonesById to point to new zone
            newZonesById = Object.assign({}, state.zonesById);
            newZonesById[zoneId] = newZone;
        
            newState = {
                zonesById: newZonesById,
            }
            return newState;
    }

    return state;
};

// http://redux.js.org/docs/recipes/UsingObjectSpreadOperator.html
// didn't work
// zonesById: {
// ...state.zonesById,
//         [id]: {
//         id: zoneData.id,
//             zone: newZone
//     }
// }
