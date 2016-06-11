/**
 * Created by tedshaffer on 6/10/16.
 */
import { CREATE_DEFAULT_SIGN } from '../actions/index';
import { ADD_PLAYLIST_ITEM} from '../actions/index';

export default function(state = [], action) {

    console.log("reducer_sign:: action.type=" + action.type);

    switch (action.type) {
        case CREATE_DEFAULT_SIGN:
            return action.payload.sign;

        case ADD_PLAYLIST_ITEM:


            // current playlist has been updated
            // TODO - how does the code know which playlist is the current playlist?
            
            console.log("reducer_sign with ADD_PLAYLIST_ITEM invoked");

            // TODO - better way to do this
            const updatedCurrentPlaylist = action.payload;

            let newSign = Object.assign({}, state);
            newSign.zones[0].zonePlaylist = updatedCurrentPlaylist;

            return Object.assign({}, newSign);
    }

    return state;
}