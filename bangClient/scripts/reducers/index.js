/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaItemThumbsReducer from './reducer_media_item_thumbs';
import MediaFolderReducer from './reducer_media_folder';
import MediaLibraryPlaylistItemsReducer from './reducer_media_library_playlist_items';
import SignReducer from './reducer_sign';
import CurrentPlaylistReducer from './reducer_current_playlist';

const rootReducer = combineReducers({
    mediaItemThumbs: MediaItemThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    sign: SignReducer,
    currentPlaylist: CurrentPlaylistReducer,
});

export default rootReducer;
