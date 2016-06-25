/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE } from '../actions/index';

const initialState =
{
    zones: [],
    zonesById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_zones:: action.type=" + action.type);

    switch (action.type) {
        case NEW_ZONE:
            const zoneData = action.payload;

            const newZone =
            {
                id: zoneData.id,
                type: zoneData.type,
                name: zoneData.name
            };

            // not convinced this is right - I don't think it is
            // let newZonesById = [ ...state.zonesById ];
            // newZonesById[zoneData.id] = newZone;

            // works for first zone only (at best)
            let newZonesById = {};
            newZonesById = {
                id: zoneData.id,
                zone: newZone
            };

            const newState = {
                zones: state.zones.concat(newZone),
                zonesById: newZonesById
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
