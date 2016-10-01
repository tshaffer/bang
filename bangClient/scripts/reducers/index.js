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
import MediaStatesReducer from './reducer_media_states';
import PlaylistItemsReducer from './reducer_playlist_items';
import HtmlSitesReducer from './reducer_html_sites';

import TransitionsReducer from './reducer_transitions';


const rootReducer = combineReducers({
    mediaThumbs: MediaThumbsReducer,
    mediaFolder: MediaFolderReducer,
    mediaLibraryPlaylistItems: MediaLibraryPlaylistItemsReducer,
    
    sign: SignReducer,
    zones: ZonesReducer,
    zonePlaylists: ZonePlaylistsReducer,
    mediaStates: MediaStatesReducer,
    playlistItems: PlaylistItemsReducer,
    htmlSites: HtmlSitesReducer,

    transitions: TransitionsReducer,
});

export default rootReducer;
