/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaThumbsReducer from './reducerMediaThumbs';
import MediaFolderReducer from './reducerMediaFolder';
import MediaObjectReducer from './reducerMediaObject';
import SelectedMediaStatesReducer from './reducerSelectedMediaStates';

const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaObjects: MediaObjectReducer,
    selectedMediaStates: SelectedMediaStatesReducer
});

export default rootReducer;
