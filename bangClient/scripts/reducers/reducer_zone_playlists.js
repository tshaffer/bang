/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST } from '../actions/index';

const initialState =
{
    zonePlaylists: [],
    zonePlaylistsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_zone_playlists:: action.type=" + action.type);

    switch (action.type) {
        case NEW_ZONE_PLAYLIST:
            const zonePlaylist = action.payload;

            const newZonePlaylist =
            {
                id: zonePlaylist.id,
                items: []
            };

            const newItem = {};
            newItem[zonePlaylist.id] = newZonePlaylist;
            const newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

            const newState = {
                zonePlaylists: state.zonePlaylists.concat(newZonePlaylist),
                zonePlaylistsById: newZonePlaylistsById
            }
            return newState;
    }

    return state;
};
