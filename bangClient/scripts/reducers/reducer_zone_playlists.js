/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, ADD_PLAYLIST_ITEM } from '../actions/index';

const initialState =
{
    zonePlaylists: [],
    zonePlaylistsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_zone_playlists:: action.type=" + action.type);

    let newState;
    let newZonePlaylist;
    let newZonePlaylistsById;

    switch (action.type) {
        case NEW_ZONE_PLAYLIST:
            const zonePlaylist = action.payload;

            newZonePlaylist =
            {
                id: zonePlaylist.id,
                playlistItems: []
            };

            const newItem = {};
            newItem[zonePlaylist.id] = newZonePlaylist;
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

            newState = {
                zonePlaylists: state.zonePlaylists.concat(newZonePlaylist),
                zonePlaylistsById: newZonePlaylistsById
            }
            return newState;
        case ADD_PLAYLIST_ITEM:
            const zonePlaylistId = action.zonePlaylistId;
            const playlistItem = action.playlistItem;
            const index = action.index;

            // make copy of existing fields
            const newZonePlaylists = Object.assign([], state.zonePlaylists);
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            const existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
            const newPlaylistItems = Object.assign([], existingZonePlaylist.playlistItems);

            // add playlist item in proper position
            if (index >= 0) {
                // insert prior to index
                newPlaylistItems.splice(index, 0, playlistItem);
            }
            else {
                // append to list
                newPlaylistItems.push(playlistItem);
            }

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItems = newPlaylistItems;

            // find and replace this zonePlaylist in both zonePlaylists and zonePlaylistsById
            newZonePlaylists.forEach(function(zonePlaylist, index) {
                if (zonePlaylist.id == zonePlaylistId) {
                    newZonePlaylists[index] = newZonePlaylist;
                }
            });
            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylists: newZonePlaylists,
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;
    }

    return state;
};
