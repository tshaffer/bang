/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import ThumbsReducer from './reducer_thumbs';
import MediaFolderReducer from './reducer_media_folder';

// import { REQUEST_MEDIA_FOLDER } from '../actions/index';

const rootReducer = combineReducers({
    thumbs: ThumbsReducer,
    mediaFolder: MediaFolderReducer,
});

// function receivedMediaFolder(state = [], action) {
//     switch (action.type) {
//         case REQUEST_MEDIA_FOLDER:
//             return "";
//         default:
//             return state;
//     }
// }

export default rootReducer;
