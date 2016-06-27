/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaThumbsReducer from './reducer_media_thumbs';
import MediaFolderReducer from './reducer_media_folder';
import MediaLibraryPlaylistItemsReducer from './reducer_media_library_playlist_items';

import SignReducer from './reducer_sign';
import ZonesReducer from './reducer_zones';
import ZonePlaylistsReducer from './reducer_zone_playlists';
import PlaylistItemsReducer from './reducer_playlist_items';

const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    
    sign: SignReducer,
    zones: ZonesReducer,
    zonePlaylists: ZonePlaylistsReducer,
    playlistItems: PlaylistItemsReducer
});

export default rootReducer;
