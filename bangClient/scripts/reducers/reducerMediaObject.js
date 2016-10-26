/**
 * Created by tedshaffer on 10/26/16.
 */
import { ADD_MEDIA_OBJECTS } from '../actions/index';

// const initialState =
//     {
//         mediaObjectByPath: {}
//     };

export default function(state = [], action) {

    switch (action.type) {

        // case ADD_MEDIA_OBJECTS:
        //     {
        //         const mediaObjects = action.payload;
        //
        //         let newMediaObjectByPath = {};
        //
        //         mediaObjects.forEach( (mediaObject) => {
        //             newMediaObjectByPath[mediaObject.path] = mediaObject;
        //         });
        //
        //         let newState = {
        //             mediaObjectByPath: newMediaObjectByPath
        //         };
        //         return newState;
        //     }
        case ADD_MEDIA_OBJECTS:
            return action.payload;
    }

    return state;
}
