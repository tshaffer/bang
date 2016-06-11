/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaLibraryPlaylistItemsReducer from './reducer_media_library_playlist_items';
import MediaFolderReducer from './reducer_media_folder';
import MediaItemThumbsReducer from './reducer_media_item_thumbs';
import SignReducer from './reducer_sign';
import CurrentPlaylistReducer from './reducer_current_playlist';

const rootReducer = combineReducers({
    sign: SignReducer,
    currentPlaylist: CurrentPlaylistReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    mediaFolder: MediaFolderReducer,
    mediaItemThumbs: MediaItemThumbsReducer
});

export default rootReducer;
