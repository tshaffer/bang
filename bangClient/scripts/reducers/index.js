/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaLibraryContentsReducer from './reducer_media_library_contents';
import ThumbsReducer from './reducer_thumbs';

const rootReducer = combineReducers({
    mediaLibraryContents: MediaLibraryContentsReducer,
    thumbs: ThumbsReducer
});

export default rootReducer;
