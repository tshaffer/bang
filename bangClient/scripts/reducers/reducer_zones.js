/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE } from '../actions/index';

export default function(state = [], action) {

    console.log("reducer_zones:: action.type=" + action.type);

    switch (action.type) {
        case NEW_ZONE:
            const zoneData = action.payload;

            const newState = state.concat(
                {
                    id: zoneData.id,
                    type: zoneData.type,
                    name: zoneData.name
                }
            );

            // const newState = Object.assign({},
            //     ...state,
            //     {
            //         type: zoneData.zoneType,
            //         name: zoneData.zoneName
            //     }
            // );
            // const newState = Object.assign({}, state, {
            //     zones: [
            //         ...state.zones,
            //         {
            //             type: zoneData.zoneType,
            //             name: zoneData.zoneName
            //         }
            //     ]
            // });
            // return newState;
            return newState;
    }

    return state;
};
