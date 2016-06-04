/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaLibraryContentsReducer from './reducer_media_library_contents';

const rootReducer = combineReducers({
    mediaLibraryContents: MediaLibraryContentsReducer
});

export default rootReducer;
