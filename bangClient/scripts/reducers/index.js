/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import MediaThumbsReducer from './reducer_media_thumbs';
import MediaFolderReducer from './reducer_media_folder';
import MediaLibraryPlaylistItemsReducer from './reducer_media_library_playlist_items';
import CurrentPlaylistReducer from './reducer_current_playlist';

import SignReducer from './reducer_sign';
import ZonesReducer from './reducer_zones';
import ZonePlaylistsReducer from './reducer_zone_playlists';

import SelectedZoneReducer from './reducer_selected_zone';
import SelectedPlaylistItemReducer from './reducer_selected_playlist_item';

const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    currentPlaylist: CurrentPlaylistReducer,
    
    selectedPlaylistItem: SelectedPlaylistItemReducer,
    selectedZone: SelectedZoneReducer,

    sign: SignReducer,
    zones: ZonesReducer,
    zonePlaylists: ZonePlaylistsReducer

});

export default rootReducer;
