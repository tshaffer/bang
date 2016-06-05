/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import ThumbsReducer from './reducer_thumbs';
import MediaFolderReducer from './reducer_media_folder';

const rootReducer = combineReducers({
    thumbs: ThumbsReducer,
    mediaFolder: MediaFolderReducer
});

export default rootReducer;
