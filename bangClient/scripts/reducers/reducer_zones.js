/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE, SET_ZONE_PLAYLIST } from '../actions/index';

const initialState =
{
    zones: [],
    zonesById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_zones:: action.type=" + action.type);

    let newZone = null;
    let newState = null;
    let newZonesById = null;

    switch (action.type) {
        case NEW_ZONE:
            const zoneData = action.payload;

            newZone =
            {
                id: zoneData.id,
                type: zoneData.type,
                name: zoneData.name,
                zonePlaylistId: null
            };

            // const newZonesById = {
            //     ...state.zonesById,
            //     [zoneData.id]: newZone
            // };

            // TODO - figure out best way to do this in ES6
            const newItem = {};
            newItem[zoneData.id] = newZone;
            newZonesById = Object.assign({}, state.zonesById, newItem);

            newState = {
                zones: state.zones.concat(newZone),
                zonesById: newZonesById,
                selectedZone: newZone
            }
            return newState;

        case SET_ZONE_PLAYLIST:
            const zoneId = action.payload.zoneId;
            const zonePlaylistId = action.payload.zonePlaylistId;

            // TODO - figure out best way to do this in ES6
            // const zone = state.zonesById[zoneId];
            // newZone = Object.assign({}, zone);
            // newZone.zonePlaylistId = zonePlaylistId;
            newZone = Object.assign({}, state.zonesById[zoneId], {zonePlaylistId: zonePlaylistId});

            // update newZones with newZone
            const newZones = Object.assign([], state.zones);
            for (let zoneIndex = 0; zoneIndex < state.zones.length; zoneIndex++) {
                if (newZones[zoneIndex].id === zoneId) {
                    newZones[zoneIndex] = newZone;
                    break;
                }
            }

            // update zonesById to point to new zone
            newZonesById = Object.assign({}, state.zonesById);
            newZonesById[zoneId] = newZone;

            newState = {
                zones: newZones,
                zonesById: newZonesById,
                selectedZone: newZone
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
