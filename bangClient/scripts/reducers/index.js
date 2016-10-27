/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaThumbsReducer from './reducerMediaThumbs';
import MediaFolderReducer from './reducerMediaFolder';
import MediaObjectReducer from './reducerMediaObject';

const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaObjects: MediaObjectReducer
});

export default rootReducer;
