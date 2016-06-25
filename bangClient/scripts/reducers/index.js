/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaThumbsReducer from './reducer_media_thumbs';
import MediaFolderReducer from './reducer_media_folder';
import MediaLibraryPlaylistItemsReducer from './reducer_media_library_playlist_items';
import CurrentPlaylistReducer from './reducer_current_playlist';
import SelectedPlaylistItemReducer from './reducer_selected_playlist_item';

import SignReducer from './reducer_sign';
import ZonesReducer from './reducer_zones';

const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    sign: SignReducer,
    zones: ZonesReducer,
    currentPlaylist: CurrentPlaylistReducer,
    selectedPlaylistItem: SelectedPlaylistItemReducer
});

export default rootReducer;
